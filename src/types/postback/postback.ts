/* ── 포스트백 로그 ───────────────────────────────────────────────────────────
   제휴사가 보내온 포스트백을 「받은 값 그대로」 확인하는 화면이다.
   서버가 두 제휴사(쿠팡·링크프라이스)를 한 규격으로 정리해 주고, 수신 원문은
   payload 에 손대지 않은 채로 함께 담아 준다 — 그래서 화면은 계산하지 않고
   정리된 값을 그대로 적고, 펼치면 payload 원문을 보여 준다.
   제휴 수수료 매출·환수 금액·적립 예상 같은 파생값은 전부 다른 화면 몫이다.
   ───────────────────────────────────────────────────────────────────────── */

export type IPostbackSource = 'COUPANG' | 'LINKPRICE';

// 목록 거르개용 — ALL 은 「거르지 않음」이라 서버로 보내지 않는다
export type IPostbackAction = 'PURCHASE' | 'CANCEL';
export type IPostbackActionFilter = IPostbackAction | 'ALL';

/* 처리 결과 — 이 화면의 존재 이유에 가장 가깝다.
   PROCESSED 반영됨 · SKIPPED 건너뜀(중복 등) · FAILED 처리 실패.
   왜 그렇게 되었는지는 result_note 에 문장으로 온다. */
export type IPostbackResult = 'PROCESSED' | 'SKIPPED' | 'FAILED';

/* 주문 한 줄 — 쿠팡 order_detail 한 칸, 링크프라이스 콜백 한 건에 해당한다.
   서버가 두 규격을 이 모양으로 맞춰 준다. 안 온 값은 null 로 온다(0 이 아니다). */
export interface IPostbackLogLine {
  price: number | null;
  quantity: number | null;
  commission: number | null;
  product_code: string | null;
  product_name: string | null;
  /* 취소 ↔ 전 구매 대사 결과. 짝을 못 찾으면 null.
     짝이 있을 때의 생김새는 아직 확인되지 않아 모양을 못 박지 않는다 —
     화면은 「있다/없다」만 쓰고 내용은 원문 그대로 보여 준다. */
  matched: unknown | null;
}

/* 수신 원문. 제휴사마다 키가 아예 다르고(겹치는 필드가 하나도 없다) 건마다 빠진 키도 있어
   모양을 못 박지 않는다 — 화면은 받은 키를 받은 순서대로 훑어 그대로 적는다.
   order_detail 만 배열이라 따로 떼어 표로 그린다. */
export type IPostbackPayload = Record<string, unknown> & {
  order_detail?: unknown[];
};

export interface IPostbackLog {
  id: string;
  source: IPostbackSource;
  action: IPostbackAction;
  created_at: string; // 우리가 받은 시각(ISO)
  user_id: string | null;
  user_nickname: string | null;
  sub_id: string | null; // 쿠팡 subid
  merchant_code: string | null;
  merchant_id: string | null;
  merchant_name: string | null;
  order_code: string | null;
  line_count: number;
  total_quantity: number;
  total_amount: number;
  total_commission: number;
  lines: IPostbackLogLine[];
  result: IPostbackResult;
  result_note: string | null;
  payload: IPostbackPayload;
  // 쿠팡에만 온다 — 대사(취소 ↔ 전 구매)가 몇 줄 맞았는지
  matched_line_count?: number;
  is_fully_matched?: boolean;
}

export interface IPostbackLogList {
  rows: IPostbackLog[];
  count: number;
}

/* 목록 조회 파라미터 — 서버가 받는 것은 이 다섯 개뿐이다.
   검색(keyword)·구분(action)·쪽나눔을 서버가 처리한다: 화면에서 걸러 두면 서버가
   잘라 준 쪽나눔과 어긋난다(2쪽을 보는 중에 걸러도 1쪽에 있던 건은 걸러지지 않는다). */
export interface IPostbackListParams {
  page: number;
  limit: number;
  source: IPostbackSource;
  keyword?: string;
  action?: IPostbackActionFilter;
}

/* 머천트 고르는 칸에 채울 목록 — 서버가 따로 내려 준다.
   value 는 거를 때 쓰는 코드(merchant_code)이고, label 은 사람이 읽는 이름,
   count 는 그 머천트로 들어온 포스트백 수다.
   목록이 source 로 갈려 오지 않아 쿠팡 것도 함께 온다 — 화면이 탭에 맞게 추리지 않는다:
   서버가 준 목록을 임의로 잘라 내면 화면에 없는 머천트가 왜 없는지 알 길이 없어진다. */
export interface IPostbackMerchantOption {
  value: string;
  label: string;
  count: number;
}

export type IPostbackTab = 'coupang' | 'linkprice';

/* 화면이 들고 있는 거르개 상태 — 탭마다 따로 둔다.
   각 탭이 자기 검색·거르개를 갖고 서로 건드리지 않는다: 한쪽에 걸러도 다른 쪽은 그대로다.
   검색어는 「검색」을 눌러야(또는 Enter) 나가고, 고르는 칸은 고르는 즉시 나간다. */
export interface IPostbackCoupangFilters {
  search: string;
  kind: IPostbackActionFilter;
}

export interface IPostbackLinkpriceFilters {
  search: string;
  merchantId: string;
}
