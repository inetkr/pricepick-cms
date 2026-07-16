import type { IPolicyType } from 'src/types/common';

export interface ITermsTab {
  type: IPolicyType;
  label: string;
}

// 약관 관리 탭 = IPolicyType 값 하나당 탭 하나. Policy API의 by_type 조회 키로 그대로 사용된다.
export const TERMS_TABS: ITermsTab[] = [
  { type: 'TERMS_OF_SERVICE', label: '서비스 이용약관' },
  { type: 'PRIVACY_POLICY', label: '개인정보 처리방침' },
  { type: 'TICKET_REWARD_POLICY', label: '티켓 보상 정책' },
  { type: 'MARKETING_CONSENT', label: '마케팅 수신 동의' },
];
