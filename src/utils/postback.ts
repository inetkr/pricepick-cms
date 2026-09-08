import type {
  IPostbackLog,
  IPostbackLogLine,
  IPostbackPayload,
  IPostbackSource,
  IPostbackTab,
} from 'src/types/postback/postback';

/* ── 포스트백 로그 ───────────────────────────────────────────────────────────
   서버가 두 제휴사를 한 규격으로 정리해 주므로 화면은 다시 계산하지 않는다 —
   합계도 대사(취소 ↔ 전 구매)도 서버가 이미 해서 내려준다.
   여기 있는 건 표기(날짜·천 단위·상태 이름)와 수신 원문(payload)을 읽는 방법뿐이다.
   값이 안 왔으면 0으로 채우지 않고 빈 걸 그대로 드러낸다 — 0과 「모른다」는 다르다.
   ───────────────────────────────────────────────────────────────────────── */

/* ── 표기 ── */

export const pbN = (n: number | null | undefined) => (n ?? 0).toLocaleString('ko-KR');

export const pbHasValue = (v: unknown) => v !== null && v !== undefined && v !== '';

const toDate = (v: string | Date | null | undefined): Date | null => {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const pbDt = (v: string | Date | null | undefined) => {
  const d = toDate(v);
  if (!d) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return [d.getFullYear(), mm, dd].join('/');
};

export const pbTm = (v: string | Date | null | undefined) => {
  const d = toDate(v);
  if (!d) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return [hh, mi, ss].join(':');
};

/* 제휴사가 보낸 시각 문자열을 Date 로 — 유닉스 초/밀리초, YYYYMMDDHHMMSS(링크프라이스
   day+time), 그 외 ISO 계열을 받는다. 해석이 안 되면 null 을 돌려 원문만 그대로 보이게 둔다. */
export const pbTimeDate = (v: string | number | null | undefined): Date | null => {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).trim();
  if (/^\d{10}$/.test(s)) return new Date(Number(s) * 1000);
  if (/^\d{13}$/.test(s)) return new Date(Number(s));
  if (/^\d{14}$/.test(s)) {
    const ymd = [s.slice(0, 4), s.slice(4, 6), s.slice(6, 8)].join('-');
    const hms = [s.slice(8, 10), s.slice(10, 12), s.slice(12, 14)].join(':');
    return toDate([ymd, hms].join('T'));
  }
  if (/^\d{8}$/.test(s)) {
    return toDate([s.slice(0, 4), s.slice(4, 6), s.slice(6, 8)].join('-'));
  }
  return toDate(s);
};

/* 금액 표기 — 천 단위를 찍는다. 숫자로 못 읽으면 받은 값을 그대로 돌려준다
   (임의로 0으로 바꾸면 「안 온 값」이 「0원」으로 둔갑한다). */
export const pbMoneyText = (v: number | string | null | undefined): string => {
  if (!pbHasValue(v)) return '';
  const t = String(v).replace(/[^0-9.-]/g, '');
  const n = t === '' || t === '-' || t === '.' ? NaN : Number(t);
  return Number.isNaN(n) ? String(v) : pbN(n);
};

/* ── 탭 ↔ source ── */

export const PB_TAB_SOURCE: Record<IPostbackTab, IPostbackSource> = {
  coupang: 'COUPANG',
  linkprice: 'LINKPRICE',
};

/* ── 구분 배지 ──
   받은 값을 그대로 적는다(purchase / cancel). 로그 화면이라 서버가 준 말과 화면에 뜬
   말이 같아야 문의가 왔을 때 바로 짚을 수 있다. */
export const PB_KIND_BADGE: Record<string, string> = {
  purchase: 'badge badge-blue',
  cancel: 'badge badge-red',
};

/* ── 수신 원문(payload) 읽기 ──
   payload 는 제휴사가 보낸 그대로다. 키를 못 박아 두고 하나씩 꺼내 쓴다 —
   화면에 적는 순서가 곧 명세의 순서라, 안 온 키는 빈칸으로 드러난다. */
export const pbField = (payload: IPostbackPayload | null | undefined, key: string): string => {
  const v = payload?.[key];
  if (!pbHasValue(v)) return '';
  if (typeof v === 'object') {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
};

/* 쿠팡 order_detail 한 칸의 상품번호 키 — 구매는 productid(소문자 i), 취소는 productId(대문자 I)
   로 온다. 오타가 아니라 쿠팡 규격이 그래서, 어느 키로 왔는지를 화면에 그대로 적는다. */
export const pbCoupangPidKey = (
  payload: IPostbackPayload | null | undefined,
  index: number
): string => {
  const detail = payload?.order_detail;
  const item = Array.isArray(detail)
    ? (detail[index] as Record<string, unknown> | undefined)
    : null;
  if (!item) return '';
  if (pbHasValue(item.productid)) return 'productid';
  if (pbHasValue(item.productId)) return 'productId';
  return '';
};

/* 제휴사가 보낸 주문 시각 — 쿠팡은 purchase_time, 링크프라이스는 day + time.
   우리가 받은 시각(created_at)과는 다른 값이라 둘을 섞지 않는다:
   큰 글씨는 제휴사가 보낸 시각이고, 원문 문자열을 그 밑에 그대로 남긴다.
   제휴사 시각이 안 왔으면 null 을 돌려 화면이 created_at 으로 넘어가게 둔다. */
export const pbMerchantTime = (
  row: IPostbackLog
): { raw: string; at: Date | null; hasTime: boolean } => {
  const p = row.payload ?? {};
  if (row.source === 'COUPANG') {
    const raw = pbField(p, 'purchase_time');
    return { raw, at: pbTimeDate(raw), hasTime: /\d{2}:\d{2}|\d{14}|^\d{10,13}$/.test(raw) };
  }
  const day = pbField(p, 'day');
  const time = pbField(p, 'time');
  const raw = [day, time].filter(Boolean).join(' · ');
  /* time 이 안 오면 날짜만 잡힌다. 이때 하루의 시작(00:00:00)을 시각처럼 적으면
     받지도 않은 값을 적는 셈이라, 시·분·초를 아예 안 보이게 hasTime 으로 알린다. */
  return { raw, at: pbTimeDate(day + time), hasTime: Boolean(time) };
};

/* ── 수신 원문을 온 그대로 훑기 ──
   키 목록을 못 박아 두면 두 가지가 동시에 깨진다: 이번 건에 안 온 키가 빈칸으로 남아
   있지도 않은 자리를 만들고, 제휴사가 새로 붙인 키는 화면에 아예 안 나온다.
   실제로 링크프라이스는 건마다 보내는 키가 다르다(time·category_code·base_commission 이
   통째로 빠진 건이 온다). 그래서 받은 키를 받은 순서대로 훑는다 —
   화면에 뜬 키 = 이번에 실제로 온 키다. */

/* 배열로 오는 건 이것뿐이다. 서버가 이걸 lines 로 정리해 주므로 원문 칸에서는 빼고
   lines 쪽에 한 번만 적는다 — 같은 값을 두 번 적으면 어느 쪽이 원문인지 흐려진다. */
export const PB_PAYLOAD_ARRAY_KEY = 'order_detail';

export const pbPayloadEntries = (
  payload: IPostbackPayload | null | undefined
): [string, string][] =>
  Object.keys(payload ?? {})
    .filter((k) => k !== PB_PAYLOAD_ARRAY_KEY)
    .map((k): [string, string] => [k, pbField(payload, k)]);

/* ── 주문 줄(lines) ──
   서버가 두 제휴사의 주문 줄을 한 규격으로 맞춰 준 것이다. order_detail 은 이 lines 로
   정리되어 나오므로 원문 칸에서는 빼고 여기 표로 한 번만 그린다.
   칸 이름은 서버가 준 키 그 자체를 쓴다 — 우리말로 바꿔 적어 두면 규격에 칸이 하나 늘 때
   그 칸만 조용히 화면에서 빠진다. */

/* 칸 이름 — 줄마다 키가 다를 수 있어 합집합을 만들되 먼저 나온 순서를 지킨다:
   한 줄에만 있는 키도 표에서 사라지지 않는다. */
export const pbLineKeys = (lines: IPostbackLogLine[] | null | undefined): string[] => {
  const keys: string[] = [];
  (lines ?? []).forEach((line) => {
    Object.keys((line ?? {}) as unknown as Record<string, unknown>).forEach((k) => {
      if (!keys.includes(k)) keys.push(k);
    });
  });
  return keys;
};

/* 값 표기 — 숫자로 온 값만 천 단위를 찍는다. 키 이름을 보고 고르지 않는다:
   금액 키 이름을 적어 두면 제휴사가 키를 바꿀 때 그 칸만 조용히 서식이 풀린다.
   객체(matched)는 원문 그대로 JSON 으로 적는다 — 짝이 있을 때의 생김새를 아직 모른다. */
export const pbLineText = (line: IPostbackLogLine | null | undefined, key: string): string => {
  const rec = (line ?? {}) as unknown as Record<string, unknown>;
  const v = rec[key];
  if (!pbHasValue(v)) return '';
  if (typeof v === 'number') return pbN(v);
  return pbField(rec as IPostbackPayload, key);
};

/* 칸 꾸밈도 키 이름으로 고른다 — 상품번호는 좁게, 상품명은 넓고 잘리게.
   못 맞히면 꾸밈이 없을 뿐 표는 그대로 그려진다. */
export const pbLineCellClass = (key: string): string => {
  const k = key.toLowerCase();
  if (k === 'productid' || k === 'product_code') return 'pb-pid';
  if (k === 'productname' || k === 'product_name') return 'pb-pname';
  return '';
};
