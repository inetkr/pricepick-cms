import React, { useEffect, useState } from 'react';
import { merchantAPI } from 'src/api';
import { Modal } from 'src/components/common/modal';
import type {
  IAffiliateMall,
  IAffiliateMallApprovalStatus,
} from 'src/types/config/ticket_accrual_config';
import type { IMerchantDetail, IMerchantRawDetail } from 'src/types/merchants/merchant';

const APPROVAL_LABEL: Record<IAffiliateMallApprovalStatus, string> = {
  APPROVED: '승인',
  PENDING: '승인대기',
  REJECTED: '거부',
  NOT_APPLIED: '미신청',
};

const APPROVAL_BADGE_CLASS: Record<IAffiliateMallApprovalStatus, string> = {
  APPROVED: 'badge-green',
  PENDING: 'badge-amber',
  REJECTED: 'badge-red',
  NOT_APPLIED: 'badge-gray',
};

// 값이 어디서 온 것인지 — api는 링크프라이스 광고주 조회 오픈 API 수신 항목, man은 API에 없어
// 사람이 적어 둔 항목이다. 어느 쪽인지 모르면 "왜 갱신해도 안 바뀌지?"를 되묻게 된다.
type ValueSource = 'api' | 'man';

const SourceTag: React.FC<{ source: ValueSource }> = ({ source }) => (
  <span className={`ta-tag ${source}`}>{source === 'api' ? 'API' : '수기'}</span>
);

// 링크프라이스가 아직 값을 내려주지 않은 칸 — 지어내지 않고 "갱신 필요"로 비워 둔다.
const NeedSync: React.FC = () => <span className="ta-needsync">갱신 필요</span>;

const isEmpty = (v: unknown): boolean => v == null || String(v).trim() === '';

// 2026-09-23T05:52:33.860Z → 2026-09-23 14:52 (현지 시각)
const formatSyncedAt = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const p = (v: number) => String(v).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

// 정산 방식처럼 "^"로 이어 붙여 오는 목록을 읽을 수 있게 편다 — 항목 자체는 손대지 않는다.
const splitCaret = (v: string | undefined): string =>
  String(v ?? '')
    .split('^')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' · ');

const ynLabel = (v: string | undefined): string => {
  if (v === 'Y') return '지원(Y)';
  if (v === 'N') return '미지원(N)';
  return v ?? '—';
};

// reward_yn은 Y·N 말고 A(리워드·비리워드 둘 다)가 있다 — 두 갈래로만 처리하면 안 된다.
const rewardYnLabel = (v: string | undefined): string => (v === 'A' ? '둘 다(A)' : ynLabel(v));

// 활동 불가 방식(deny_ad)에 "리워드"가 적혀 있는데 리워드 가능 여부는 Y인 몰이 있다. 서로 어긋나므로
// 우리가 판정하지 않고 "확인 필요"로 표시만 한다.
const isRewardRestricted = (raw: IMerchantRawDetail | null): boolean =>
  /리워드/.test(String(raw?.deny_ad ?? ''));

const KvRow: React.FC<{ label: string; source: ValueSource; children: React.ReactNode }> = ({
  label,
  source,
  children,
}) => (
  <div className="ta-kv">
    <div className="k">
      {label}
      <SourceTag source={source} />
    </div>
    <div className="v">{children}</div>
  </div>
);

// API 수신 항목은 값이 비면 "갱신 필요", 수기 항목은 그냥 "—"로 둔다.
const KvText: React.FC<{ label: string; value?: string | number | null; source: ValueSource }> = ({
  label,
  value,
  source,
}) => (
  <KvRow label={label} source={source}>
    {isEmpty(value) ? (source === 'api' ? <NeedSync /> : '—') : String(value)}
  </KvRow>
);

const KvLink: React.FC<{ label: string; url?: string | null; source: ValueSource }> = ({
  label,
  url,
  source,
}) => (
  <KvRow label={label} source={source}>
    {isEmpty(url) ? (
      source === 'api' ? (
        <NeedSync />
      ) : (
        '—'
      )
    ) : (
      <a href={String(url)} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    )}
  </KvRow>
);

// 여러 줄 원문(커미션 미인정 상품·주의사항 등)은 줄바꿈을 살려 그대로 보여준다.
const KvPre: React.FC<{ label: string; value?: string | null; source: ValueSource }> = ({
  label,
  value,
  source,
}) => (
  <KvRow label={label} source={source}>
    <div className="ta-pre">{value}</div>
  </KvRow>
);

// 실적 인정 범위 — PC / MOBILE / AOS / IOS 각각의 'Y'·'N'을 받은 그대로 칩으로 편다.
const ScopeChips: React.FC<{ raw: IMerchantRawDetail | null }> = ({ raw }) => {
  if (!raw?.mobile_yn) return <NeedSync />;
  const one = (label: string, v: string | undefined) => (
    <span key={label} className={v === 'Y' ? 'yes' : v === 'N' ? 'no' : ''}>
      {label} {v ?? '—'}
    </span>
  );
  return (
    <span className="ta-scope">
      {one('PC', raw.pc_yn)}
      {one('MOBILE', raw.mobile_yn)}
      {one('AOS', raw.app_android_yn)}
      {one('IOS', raw.app_ios_yn)}
    </span>
  );
};

interface TicketAccrualMallDetailModalProps {
  mall: IAffiliateMall | null;
  onClose: () => void;
}

// 제휴몰 이름을 누르면 열리는 "제휴몰 정보" — 목록에 없는 링크프라이스 원문(raw_detail)이 필요해
// 열릴 때마다 GET /merchant/admin/:id 를 한 건 조회한다(목록 로딩 때 110건을 미리 부르지 않는다).
const MallDetailBody: React.FC<{ mall: IAffiliateMall }> = ({ mall }) => {
  const [detail, setDetail] = useState<IMerchantDetail | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let alive = true;
    setState('loading');
    setDetail(null);
    merchantAPI
      .getDetail(mall.id)
      .then((res) => {
        if (!alive) return;
        setDetail(res?.result?.object ?? null);
        setState('ready');
      })
      .catch((error) => {
        console.error('Failed to load merchant detail:', error);
        if (!alive) return;
        setState('error');
      });
    return () => {
      alive = false;
    };
  }, [mall.id]);

  if (state === 'loading') {
    return (
      <div className="modal-body" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-2)' }}>
        불러오는 중…
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="modal-body" style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>
        제휴몰 정보를 불러오지 못했습니다.
      </div>
    );
  }

  const raw = detail?.raw_detail ?? null;
  const cookie = typeof raw?.return_day === 'number' ? `${raw.return_day}일` : '';
  const timingFull = String(raw?.when_trans ?? '').trim();
  const timingShort = timingFull.split(/[\r\n]+/)[0].trim();

  return (
    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      <div className="ta-src">
        자동 갱신 · 출처 링크프라이스 광고주 조회 오픈 API · 마지막 갱신{' '}
        {formatSyncedAt(detail?.lp_synced_at)}
      </div>

      <div className="ta-grid">
        <div>
          <KvRow label="링크프라이스 승인 상태" source="api">
            <span className={`badge ${APPROVAL_BADGE_CLASS[mall.approvalStatus]}`}>
              {APPROVAL_LABEL[mall.approvalStatus]}
            </span>
          </KvRow>
          <KvText label="커미션(모바일)" value={raw?.max_commission_mobile} source="api" />
          <KvText label="커미션(PC)" value={raw?.max_commission_pc} source="api" />
          <KvRow label="실적인정범위" source="api">
            <ScopeChips raw={raw} />
          </KvRow>
          <KvText label="광고효과인정기간" value={cookie} source="api" />
          <KvText label="실적 전송 시점" value={timingShort} source="api" />
          <KvText label="리워드 가능 여부" value={rewardYnLabel(raw?.reward_yn)} source="api" />
          {isRewardRestricted(raw) && (
            <div className="ta-flagrow">
              <span className="ta-needchk">확인 필요</span>
            </div>
          )}
        </div>

        <div>
          <KvText label="정산 방식" value={splitCaret(raw?.trans_reposition)} source="api" />
          <KvText label="지급 일정" value={raw?.commission_payment_standard} source="api" />
          <KvText label="카테고리" value={raw?.category_name ?? mall.category} source="api" />
          <KvLink label="기본링크" url={raw?.click_url ?? detail?.click_url} source="api" />
          <KvLink label="사이트 URL" url={raw?.merchant_url ?? detail?.site_url} source="api" />
        </div>
      </div>

      {/* 문장이 긴 항목은 접지 않고 2열 아래 가로 전체 폭으로 펼친다. 값이 없는 항목은 줄 자체를
          그리지 않는다 — 빈 줄이 덩그러니 남지 않게. */}
      {(!isEmpty(raw?.deny_product) ||
        !isEmpty(raw?.notice) ||
        !isEmpty(raw?.deny_ad) ||
        (timingFull && timingFull !== timingShort)) && (
        <div className="ta-full">
          {!isEmpty(raw?.deny_product) && (
            <KvPre label="커미션 미인정 상품" value={raw?.deny_product} source="api" />
          )}
          {!isEmpty(raw?.notice) && (
            <KvPre label="앱 · 브라우저 주의사항" value={raw?.notice} source="api" />
          )}
          {!isEmpty(raw?.deny_ad) && (
            <KvPre label="활동 불가 방식" value={splitCaret(raw?.deny_ad)} source="api" />
          )}
          {timingFull && timingFull !== timingShort && (
            <KvPre label="실적 전송 시점 전문" value={timingFull} source="api" />
          )}
        </div>
      )}
    </div>
  );
};

export const TicketAccrualMallDetailModal: React.FC<TicketAccrualMallDetailModalProps> = ({
  mall,
  onClose,
}) => {
  if (!mall) return null;

  return (
    <Modal
      open={!!mall}
      onClose={onClose}
      title={`제휴몰 정보 — ${mall.name} (${mall.code})`}
      width="1180px"
      footer={
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          닫기
        </button>
      }
    >
      <MallDetailBody mall={mall} />
    </Modal>
  );
};
