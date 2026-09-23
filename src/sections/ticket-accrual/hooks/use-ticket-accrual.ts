import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { merchantAPI, ticketAPI } from 'src/api';
import type {
  IAffiliateMall,
  IAffiliateMallApprovalStatus,
} from 'src/types/config/ticket_accrual_config';
import type { ITicketValueConfigValue } from 'src/types/config/ticket_value_config';
import type { IMerchant } from 'src/types/merchants/merchant';
import {
  accrualRateCap,
  defaultAccrualRate,
  isValidAccrualRate,
  isValidFeeRate,
  toAffiliateMall,
} from 'src/utils/ticket-accrual';
import { DEFAULT_TICKET_VALUE, fromApiTicketValue } from 'src/utils/ticket-value';

const LIST_PAGE_SIZE = 200;

export type TicketAccrualFilters = {
  category: string;
  approvalStatus: IAffiliateMallApprovalStatus | '';
  applied: '' | 'true' | 'false';
};

const DEFAULT_FILTERS: TicketAccrualFilters = {
  category: '',
  approvalStatus: '',
  applied: 'true',
};

// filters 조건에 맞는 몰만 남긴다 — searchCatalogMalls는 서버에 같은 조건으로 다시 묻지만,
// 초기 로딩(loadConfig)은 총 건수(totalCatalogCount) 계산을 위해 이미 받아 둔 전체 목록에
// DEFAULT_FILTERS를 그대로 적용해 표시 목록만 추려낸다.
const filterCatalogMalls = (
  malls: IAffiliateMall[],
  filters: TicketAccrualFilters
): IAffiliateMall[] =>
  malls.filter((m) => {
    if (filters.category && m.category !== filters.category) return false;
    if (filters.approvalStatus && m.approvalStatus !== filters.approvalStatus) return false;
    if (filters.applied !== '' && m.applied !== (filters.applied === 'true')) return false;
    return true;
  });

const mallSignature = (m: IAffiliateMall) =>
  `${m.feeRate}|${m.accrualRate}|${m.applied}|${m.approvalStatus}|${m.logoUrl}|${m.unlockDays}`;

// current를 saved 스냅샷과 비교해 바뀐 행의 id만 골라낸다 — 대표 제휴몰 목록·카탈로그 목록에
// 각각 따로 적용한다.
const diffMallIds = (current: IAffiliateMall[], saved: IAffiliateMall[]): Set<string> => {
  const savedById = new Map(saved.map((m) => [m.id, m]));
  const ids = new Set<string>();
  current.forEach((m) => {
    const s = savedById.get(m.id);
    if (!s || mallSignature(s) !== mallSignature(m)) ids.add(m.id);
  });
  return ids;
};

type MallPatch = {
  commission_rate?: number;
  accrual_rate?: number;
  is_applied?: boolean;
  lp_status?: IAffiliateMallApprovalStatus;
  img_url?: string;
};

// saved 스냅샷과 달라진 필드만 골라 PUT 페이로드를 만든다 — 대표 제휴몰·카탈로그 저장 함수가
// 공통으로 쓴다. forceLogo가 true면 logoUrl 문자열이 saved와 같아도 img_url을 patch에 넣는다 —
// 같은 원본 파일을 재업로드한 경우 base64가 우연히 바이트까지 같을 수 있는데, 그때도 사용자가
// 방금 로고 모달에서 "적용"을 누른 행위 자체는 저장되어야 하기 때문이다.
const buildMallPatch = (
  current: IAffiliateMall,
  saved: IAffiliateMall | undefined,
  forceLogo: boolean
): MallPatch => {
  const patch: MallPatch = {};
  if (!saved || saved.feeRate !== current.feeRate) patch.commission_rate = current.feeRate;
  if (!saved || saved.accrualRate !== current.accrualRate) patch.accrual_rate = current.accrualRate;
  if (!saved || saved.applied !== current.applied) patch.is_applied = current.applied;
  if (!saved || saved.approvalStatus !== current.approvalStatus) patch.lp_status = current.approvalStatus;
  if (!saved || saved.logoUrl !== current.logoUrl || forceLogo) patch.img_url = current.logoUrl;
  // unlock_days(전환 대기일 수)는 이 화면에서 보내지 않는다 — 링크프라이스 제휴몰의 등급 전환
  // 시점은 정산 구조가 정하는 값(익익월 6일 확정 후)이라 운영자가 고르는 값이 아니다.
  return patch;
};

let nextMallSeq = 1;
const slugify = (name: string) => {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
  nextMallSeq += 1;
  return `${base || 'mall'}-${Date.now()}-${nextMallSeq}`;
};

// count 페이지네이션을 끝까지 따라가 해당 merchant_source의 전체 목록을 한 번에 모은다.
// 다음 페이지가 있는지는 이전 응답의 count를 봐야 알 수 있어 병렬 호출이 불가능하다 —
// for-await 대신 재귀로 짜서 순차 호출이면서도 no-await-in-loop 린트에 걸리지 않게 한다.
const fetchAllMerchants = async (filter: Record<string, unknown>): Promise<IMerchant[]> => {
  const fetchPage = async (page: number, rows: IMerchant[]): Promise<IMerchant[]> => {
    const res = await merchantAPI.getList({
      page,
      limit: LIST_PAGE_SIZE,
      filter,
      order: [['commission_rate', 'desc']],
    });
    const object = res?.result?.object;
    const pageRows = object?.rows ?? [];
    const nextRows = [...rows, ...pageRows];
    const total = object?.count ?? nextRows.length;
    if (nextRows.length >= total || pageRows.length === 0) return nextRows;
    return fetchPage(page + 1, nextRows);
  };
  return fetchPage(1, []);
};

export const useTicketAccrual = () => {

  // 대표 제휴몰(merchant_source=MANUAL, 쿠팡)과 카탈로그(merchant_source=LINKPRICE)는 애초에
  // 서로 다른 API 호출로 가져온다 — 응답 행에는 merchant_source 필드가 내려오지 않으므로,
  // 하나로 합쳐서 필드값으로 다시 갈라내려 하면 항상 빈 목록이 된다. 두 목록을 처음부터
  // 별도 state로 들고 다닌다.
  const [primaryMalls, setPrimaryMalls] = useState<IAffiliateMall[]>([]);
  const [savedPrimaryMalls, setSavedPrimaryMalls] = useState<IAffiliateMall[]>([]);
  const [catalogMalls, setCatalogMalls] = useState<IAffiliateMall[]>([]);
  const [savedCatalogMalls, setSavedCatalogMalls] = useState<IAffiliateMall[]>([]);
  // 필터 없이 처음 불러온 전체 카탈로그 건수 — 검색 버튼으로 서버 필터를 걸면 catalogMalls는
  // 그 결과(부분집합)로 바뀌므로, "총 N개" 표기는 이 값을 따로 들고 있어야 한다.
  const [totalCatalogCount, setTotalCatalogCount] = useState(0);
  const [ticketValue, setTicketValue] = useState<ITicketValueConfigValue>(DEFAULT_TICKET_VALUE);
  const [isLoading, setIsLoading] = useState(true);
  // 대표 제휴몰과 제휴몰(링크프라이스)은 각자 카드에서 독립된 저장 버튼을 누르므로, 저장 중
  // 상태도 따로 관리한다 — 한쪽을 저장한다고 다른 쪽 버튼까지 잠기면 안 된다.
  const [isSavingPrimary, setIsSavingPrimary] = useState(false);
  const [isSavingCatalog, setIsSavingCatalog] = useState(false);
  const [isSearchingCatalog, setIsSearchingCatalog] = useState(false);
  // "링크프라이스 업데이트" 버튼 — 링크프라이스 광고주 조회 API를 지금 불러와
  // merchant_source=LINKPRICE 레코드를 서버에서 갱신한다. 결과 요약은 저장 배너처럼 카드
  // 헤더 아래 한 줄로 보여준다(성공 시 초록, 실패 시 빨강).
  const [isSyncingLinkprice, setIsSyncingLinkprice] = useState(false);
  const [linkpriceSyncMessage, setLinkpriceSyncMessage] = useState<string | null>(null);
  const [linkpriceSyncStatus, setLinkpriceSyncStatus] = useState<'ok' | 'bad' | null>(null);
  const [linkpriceSyncedAt, setLinkpriceSyncedAt] = useState<string | null>(null);

  // 로고 모달에서 파일 업로드로 "적용"한 행의 id — base64가 saved 스냅샷과 문자열까지 같아도
  // (동일 원본 재업로드) 저장 대상에서 빠지지 않도록 dirty 판정·patch 생성에서 강제로 포함시킨다.
  // 저장이 끝나면 그 시점에 반영된 id는 여기서 지운다.
  const [logoUploadIds, setLogoUploadIds] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<TicketAccrualFilters>(DEFAULT_FILTERS);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>([]);

  // 카테고리 필터 옵션은 목록 로딩과 무관하게 별도로 불러온다 — 실패해도 필터 옵션이 비는
  // 것뿐이라 전체 화면 로딩(loadConfig)을 막을 이유가 없다.
  useEffect(() => {
    merchantAPI
      .getCategories()
      .then((res) => {
        const loaded = res?.result?.object?.categories;
        if (Array.isArray(loaded)) setCategories(loaded);
      })
      .catch((error) => {
        console.error('Failed to load merchant categories:', error);
      });
  }, []);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const [manualRows, linkpriceRows, valueRes] = await Promise.all([
        fetchAllMerchants({ merchant_source: 'MANUAL' }),
        fetchAllMerchants({ merchant_source: 'LINKPRICE' }),
        ticketAPI.getTicketValueConfig(),
      ]);
      const loadedPrimary = manualRows.map((m) => toAffiliateMall(m, 'MANUAL'));
      const loadedCatalog = linkpriceRows.map((m) => toAffiliateMall(m, 'LINKPRICE'));
      const filteredCatalog = filterCatalogMalls(loadedCatalog, DEFAULT_FILTERS);
      setPrimaryMalls(loadedPrimary);
      setSavedPrimaryMalls(loadedPrimary);
      setCatalogMalls(filteredCatalog);
      setSavedCatalogMalls(filteredCatalog);
      setTotalCatalogCount(loadedCatalog.length);
      setLogoUploadIds(new Set());

      const loadedApiValue = valueRes?.result?.object?.values;
      if (loadedApiValue && typeof loadedApiValue.BRONZE === 'number') {
        setTicketValue(fromApiTicketValue(loadedApiValue));
      }
    } catch (error) {
      console.error('Failed to load ticket accrual config:', error);
      toast.error('제휴몰 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // 필터 select는 값을 고르는 즉시 서버에 다시 묻지 않는다 — "검색" 버튼을 눌렀을 때만 그 시점의
  // filters로 제휴몰(링크프라이스)을 서버에서 다시 조회한다. 결과로 catalogMalls·savedCatalogMalls를
  // 통째로 교체하므로, 검색을 누르면 그 목록에 남아 있던 미저장 변경은 함께 사라진다.
  const searchCatalogMalls = useCallback(async () => {
    setIsSearchingCatalog(true);
    try {
      const filter: Record<string, unknown> = { merchant_source: 'LINKPRICE' };
      if (filters.category) filter.category = filters.category;
      if (filters.approvalStatus) filter.lp_status = filters.approvalStatus;
      if (filters.applied !== '') filter.is_applied = filters.applied === 'true';

      const rows = await fetchAllMerchants(filter);
      const loadedCatalog = rows.map((m) => toAffiliateMall(m, 'LINKPRICE'));
      setCatalogMalls(loadedCatalog);
      setSavedCatalogMalls(loadedCatalog);
      setSelectedIds(new Set());
      setSelectMode(false);
    } catch (error) {
      console.error('Failed to search catalog malls:', error);
      toast.error('제휴몰(링크프라이스) 검색에 실패했습니다.');
    } finally {
      setIsSearchingCatalog(false);
    }
  }, [filters]);

  // id는 두 목록 사이에서 겹치지 않는 실제 서버 UUID이므로, 어느 쪽에 속한 id인지 미리 가리지
  // 않고 두 setter에 모두 매핑을 걸어도 안전하다 — 해당 없는 쪽은 조건에 걸리는 행이 없어 그대로다.
  const updateMallField = useCallback(
    (id: string, patch: Partial<Pick<IAffiliateMall, 'feeRate' | 'accrualRate'>>) => {
      setPrimaryMalls((prev) =>
        prev.some((m) => m.id === id) ? prev.map((m) => (m.id === id ? { ...m, ...patch } : m)) : prev
      );
      setCatalogMalls((prev) =>
        prev.some((m) => m.id === id) ? prev.map((m) => (m.id === id ? { ...m, ...patch } : m)) : prev
      );
    },
    []
  );

  // 로고 모달의 "적용"이 호출하는 함수 — id는 두 목록 사이에서 겹치지 않으므로 어느 쪽 소속인지
  // 가리지 않고 두 setter에 모두 매핑을 걸어도 안전하다. isUpload가 true면(파일 업로드로 적용)
  // logoUploadIds에 등록해 문자열 동일 여부와 무관하게 저장 대상으로 강제한다 — URL 직접 입력은
  // 값이 다르면 어차피 정상적으로 dirty가 잡히므로 강제할 필요가 없다.
  const updateMallLogo = useCallback((id: string, logoUrl: string, isUpload: boolean) => {
    setPrimaryMalls((prev) =>
      prev.some((m) => m.id === id) ? prev.map((m) => (m.id === id ? { ...m, logoUrl } : m)) : prev
    );
    setCatalogMalls((prev) =>
      prev.some((m) => m.id === id) ? prev.map((m) => (m.id === id ? { ...m, logoUrl } : m)) : prev
    );
    setLogoUploadIds((prev) => {
      if (!isUpload) {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const toggleApplied = useCallback((id: string) => {
    setPrimaryMalls((prev) =>
      prev.some((m) => m.id === id) ? prev.map((m) => (m.id === id ? { ...m, applied: !m.applied } : m)) : prev
    );
    setCatalogMalls((prev) =>
      prev.some((m) => m.id === id) ? prev.map((m) => (m.id === id ? { ...m, applied: !m.applied } : m)) : prev
    );
  }, []);

  const addMall = useCallback((name: string, category: string, feeRate: number) => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('몰 이름을 입력하세요.');
      return false;
    }
    if (!isValidFeeRate(feeRate)) {
      toast.error('수수료는 0~100 사이 숫자로 입력하세요.');
      return false;
    }
    const accrualRate = defaultAccrualRate(feeRate);
    const merchantCode = slugify(trimmed);
    merchantAPI
      .create({
        merchant_code: merchantCode,
        merchant_name: trimmed,
        category: category.trim() || '기타',
        merchant_source: 'LINKPRICE',
        commission_rate: feeRate,
        accrual_rate: accrualRate,
        is_applied: false,
      })
      .then((res) => {
        const created = res?.result?.object;
        const newMall: IAffiliateMall = created
          ? toAffiliateMall(created, 'LINKPRICE')
          : {
              id: merchantCode,
              code: merchantCode,
              name: trimmed,
              category: category.trim() || '기타',
              source: 'LINKPRICE',
              feeRate,
              accrualRate,
              approvalStatus: 'NOT_APPLIED',
              applied: false,
              logoUrl: '',
              unlockDays: null,
              appAndroid: null,
              appIos: null,
              whenTrans: '',
            };
        setCatalogMalls((prev) => [...prev, newMall]);
        setSavedCatalogMalls((prev) => [...prev, newMall]);
        toast.success(`${trimmed} 제휴몰이 추가되었습니다.`);
      })
      .catch((error) => {
        console.error('Failed to create merchant:', error);
        toast.error('제휴몰 추가에 실패했습니다.');
      });
    return true;
  }, []);

  const toggleSelectMode = useCallback(() => {
    setSelectMode((prev) => {
      if (prev) setSelectedIds(new Set());
      return !prev;
    });
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllVisible = useCallback(
    (checked: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        catalogMalls.forEach((m) => {
          if (checked) next.add(m.id);
          else next.delete(m.id);
        });
        return next;
      });
    },
    [catalogMalls]
  );

  // 선택 일괄 조정은 카탈로그(catalogMalls)만 고쳐 두는 임시 변경이다 — savedCatalogMalls는
  // 그대로 둬서 dirty로 잡히게 하고, 실제 서버 반영은 저장 버튼을 눌렀을 때 처리한다.
  // 입력한 숫자는 적립률 그 자체가 아니라 "커미션의 몇 %를 돌려줄지"라는 비율이다 — 몰마다
  // 커미션이 다르므로 같은 적립률을 일괄로 박으면 커미션이 낮은 몰은 그대로 역마진이 된다.
  // 되돌릴 수 없는 일괄 덮어쓰기라 실행 전에 확인을 받는다.
  const bulkApplyRate = useCallback(
    (ratio: number) => {
      if (selectedIds.size === 0) {
        toast.error('선택된 몰이 없습니다. "선택"을 눌러 몰을 체크하세요.');
        return;
      }
      if (!window.confirm(`선택한 ${selectedIds.size}개 몰의 적립률을 덮어씁니다. 계속할까요?`)) {
        return;
      }
      setCatalogMalls((prev) =>
        prev.map((m) =>
          selectedIds.has(m.id) ? { ...m, accrualRate: defaultAccrualRate(m.feeRate, ratio) } : m
        )
      );
      toast.success(
        `선택한 ${selectedIds.size}개 몰의 적립률을 커미션 × ${ratio}% 로 다시 계산했습니다. 저장 버튼을 눌러야 반영됩니다.`
      );
    },
    [selectedIds]
  );

  // bulkApplyRate와 같은 방식 — catalogMalls만 고쳐 dirty로 잡히게 하고, 실제 서버 반영은
  // 저장 버튼을 눌렀을 때 saveConfig가 처리한다.
  const bulkSetApplied = useCallback(
    (applied: boolean) => {
      if (selectedIds.size === 0) {
        toast.error('선택된 몰이 없습니다. "선택"을 눌러 몰을 체크하세요.');
        return;
      }
      setCatalogMalls((prev) =>
        prev.map((m) => (selectedIds.has(m.id) ? { ...m, applied } : m))
      );
    },
    [selectedIds]
  );

  const primaryDirtyIds = useMemo(() => {
    const ids = diffMallIds(primaryMalls, savedPrimaryMalls);
    primaryMalls.forEach((m) => {
      if (logoUploadIds.has(m.id)) ids.add(m.id);
    });
    return ids;
  }, [primaryMalls, savedPrimaryMalls, logoUploadIds]);
  const catalogDirtyIds = useMemo(() => {
    const ids = diffMallIds(catalogMalls, savedCatalogMalls);
    catalogMalls.forEach((m) => {
      if (logoUploadIds.has(m.id)) ids.add(m.id);
    });
    return ids;
  }, [catalogMalls, savedCatalogMalls, logoUploadIds]);
  const dirtyMallIds = useMemo(
    () => new Set(Array.from(primaryDirtyIds).concat(Array.from(catalogDirtyIds))),
    [primaryDirtyIds, catalogDirtyIds]
  );

  const isDirty = dirtyMallIds.size > 0;

  const invalidPrimaryIds = useMemo(
    () =>
      new Set(
        primaryMalls
          .filter((m) => !isValidFeeRate(m.feeRate) || !isValidAccrualRate(m.accrualRate))
          .map((m) => m.id)
      ),
    [primaryMalls]
  );
  const invalidCatalogIds = useMemo(
    () =>
      new Set(
        catalogMalls
          // 적립률 상한은 그 몰의 커미션이다 — 커미션보다 많이 돌려주면 역마진이라 저장을 막는다.
          .filter(
            (m) =>
              !isValidFeeRate(m.feeRate) ||
              !isValidAccrualRate(m.accrualRate, accrualRateCap(m.feeRate))
          )
          .map((m) => m.id)
      ),
    [catalogMalls]
  );
  const invalidMallIds = useMemo(
    () => new Set(Array.from(invalidPrimaryIds).concat(Array.from(invalidCatalogIds))),
    [invalidPrimaryIds, invalidCatalogIds]
  );

  // 대표 제휴몰만 저장한다 — 제휴몰(링크프라이스) 쪽 미저장 변경은 그대로 dirty로 남겨 둔다.
  const savePrimaryMalls = useCallback(async () => {
    if (invalidPrimaryIds.size > 0) {
      toast.error('수수료·적립률 입력값을 확인하세요.');
      return;
    }
    if (primaryDirtyIds.size === 0) {
      toast.error('변경된 값이 없습니다.');
      return;
    }
    setIsSavingPrimary(true);
    try {
      const savedById = new Map(savedPrimaryMalls.map((m) => [m.id, m]));
      await Promise.all(
        Array.from(primaryDirtyIds).map((id) => {
          const current = primaryMalls.find((m) => m.id === id);
          if (!current) return Promise.resolve();
          return merchantAPI.update(id, buildMallPatch(current, savedById.get(id), logoUploadIds.has(id)));
        })
      );
      setSavedPrimaryMalls(primaryMalls);
      setLogoUploadIds((prev) => {
        if (prev.size === 0) return prev;
        const next = new Set(prev);
        primaryDirtyIds.forEach((id) => next.delete(id));
        return next;
      });
      toast.success('대표 제휴몰 수수료·적립률이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save primary malls:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSavingPrimary(false);
    }
  }, [invalidPrimaryIds, primaryDirtyIds, primaryMalls, savedPrimaryMalls, logoUploadIds]);

  // 제휴몰(링크프라이스)만 저장한다 — 대표 제휴몰 쪽 미저장 변경은 그대로 dirty로 남겨 둔다.
  const saveCatalogMalls = useCallback(async () => {
    if (invalidCatalogIds.size > 0) {
      toast.error('적립률은 0 이상이고 그 몰의 커미션(모바일)을 넘을 수 없습니다.');
      return;
    }
    if (catalogDirtyIds.size === 0) {
      toast.error('변경된 값이 없습니다.');
      return;
    }
    setIsSavingCatalog(true);
    try {
      const savedById = new Map(savedCatalogMalls.map((m) => [m.id, m]));
      await Promise.all(
        Array.from(catalogDirtyIds).map((id) => {
          const current = catalogMalls.find((m) => m.id === id);
          if (!current) return Promise.resolve();
          return merchantAPI.update(id, buildMallPatch(current, savedById.get(id), logoUploadIds.has(id)));
        })
      );
      setSavedCatalogMalls(catalogMalls);
      setSelectedIds(new Set());
      setSelectMode(false);
      setLogoUploadIds((prev) => {
        if (prev.size === 0) return prev;
        const next = new Set(prev);
        catalogDirtyIds.forEach((id) => next.delete(id));
        return next;
      });
      toast.success('제휴몰(링크프라이스) 수수료·적립률이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save catalog malls:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSavingCatalog(false);
    }
  }, [catalogDirtyIds, catalogMalls, invalidCatalogIds, savedCatalogMalls, logoUploadIds]);

  // 링크프라이스 쪽에 저장 안 한 변경이 있으면 그대로 갱신을 돌리지 않는다 — searchCatalogMalls가
  // 끝에서 목록을 통째로 새로 받아오므로, 확인 없이 실행하면 편집 중이던 값이 조용히 사라진다.
  const syncLinkprice = useCallback(async () => {
    if (isSyncingLinkprice) return;
    if (
      catalogDirtyIds.size > 0 &&
      !window.confirm(
        '제휴몰(링크프라이스)에 저장하지 않은 변경이 있습니다. 링크프라이스 업데이트를 실행하면 목록을 다시 불러오면서 그 변경이 사라집니다. 계속할까요?'
      )
    ) {
      return;
    }
    setIsSyncingLinkprice(true);
    try {
      const res = await merchantAPI.syncLinkprice();
      const result = res?.result?.object;
      if (!result || !result.success) throw new Error('sync_linkprice returned success=false');

      const syncedAt = new Date(result.synced_at).toLocaleString('ko-KR');
      const parts = [`${result.total_fetched}건 조회`, `신규 ${result.inserted}`, `갱신 ${result.updated}`];
      if (result.skipped_manual > 0) parts.push(`대표 제휴몰 제외 ${result.skipped_manual}`);
      if (result.invalid_row_count > 0) parts.push(`형식 오류 ${result.invalid_row_count}`);
      if (result.no_commission_rate > 0) parts.push(`수수료율 없음 ${result.no_commission_rate}`);
      let message = `${parts.join(' · ')} · ${syncedAt}`;
      if (result.disappeared_merchant_codes.length > 0) {
        message += ` · 링크프라이스에서 사라짐: ${result.disappeared_merchant_codes.join(', ')}`;
      }
      setLinkpriceSyncMessage(message);
      setLinkpriceSyncStatus('ok');
      setLinkpriceSyncedAt(syncedAt);
      toast.success(`제휴몰 ${result.total_fetched}건을 갱신했습니다.`);
      await searchCatalogMalls();
    } catch (error) {
      console.error('Failed to sync linkprice merchants:', error);
      setLinkpriceSyncMessage('갱신 실패 — 잠시 후 다시 시도하세요.');
      setLinkpriceSyncStatus('bad');
      toast.error('링크프라이스 업데이트에 실패했습니다.');
    } finally {
      setIsSyncingLinkprice(false);
    }
  }, [catalogDirtyIds, isSyncingLinkprice, searchCatalogMalls]);

  return {
    primaryMalls,
    savedPrimaryMalls,
    catalogMalls,
    savedCatalogMalls,
    totalCatalogCount,
    ticketValue,
    isLoading,
    isSavingPrimary,
    isSavingCatalog,
    isSearchingCatalog,
    searchCatalogMalls,
    isDirty,
    dirtyMallIds,
    primaryDirtyIds,
    catalogDirtyIds,
    invalidMallIds,
    categories,
    filters,
    setFilters,
    selectMode,
    selectedIds,
    toggleSelectMode,
    toggleSelect,
    toggleSelectAllVisible,
    updateMallField,
    updateMallLogo,
    toggleApplied,
    addMall,
    bulkApplyRate,
    bulkSetApplied,
    savePrimaryMalls,
    saveCatalogMalls,
    isSyncingLinkprice,
    linkpriceSyncMessage,
    linkpriceSyncStatus,
    linkpriceSyncedAt,
    syncLinkprice,
  };
};
