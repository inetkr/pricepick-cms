// 링크프라이스 등 제휴 네트워크의 실제 심사 상태를 CMS에서 그대로 흉내내는 값이다.
// NOT_APPLIED = 아직 입점 신청 전, PENDING = 심사 대기, APPROVED = 심사 승인, REJECTED = 거부.
// merchant API의 lp_status 필드도 이제 이 값 그대로 내려온다(과거에는 한글 라벨이었으나 서버가
// 영문 enum으로 변경됨, src/utils/ticket-accrual.ts의 매핑 참고).
export type IAffiliateMallApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'NOT_APPLIED';

// merchant_source — MANUAL은 쿠팡처럼 링크프라이스를 거치지 않는 직계약 제휴몰(대표 제휴몰),
// LINKPRICE는 링크프라이스 카탈로그를 통해 관리되는 나머지 제휴몰이다.
export type IAffiliateMallSource = 'LINKPRICE' | 'MANUAL';

export type IAffiliateMall = {
  id: string;
  code: string;
  name: string;
  category: string;
  source: IAffiliateMallSource;
  // 제휴사가 우리에게 지급하는 판매 수수료율(%)
  feeRate: number;
  // 사용자에게 돌려주는 적립률(%) — 구매 확정 금액 × accrualRate/100 이 적립 예산(원)이 된다
  accrualRate: number;
  approvalStatus: IAffiliateMallApprovalStatus;
  // 링크프라이스 승인과는 별개로 실제 서비스에 반영할지 여부 — 이력 보존을 위해 삭제 대신 이 값을 끈다
  applied: boolean;
  // 몰 로고 이미지 주소 — 비어 있으면 목록에서 이름 첫 글자 배지로 대신 표시한다
  logoUrl: string;
};
