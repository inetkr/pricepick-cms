export interface Member {
  id: number;
  nickname: string;
  kakaoId: string;
  joinType: string;
  joinDate: string;
  joinTime: string;
  randomTicket: number;
  conversion: { type: 'bronze' | 'silver' | 'gold'; n: string }[];
  tickets: {
    grade: { bronze: number; silver: number; gold: number };
    event: number;
  };
  marketing: 'all' | 'sel' | 'none';
  status: '정상' | '정지' | '탈퇴';
  accounts: {
    type: string;
    label: string;
    email: string;
    joinDate: string;
  }[];
}

export interface MemberStats {
  total: number;
  kakao: number;
  notLinked: number;
  marketingAgreed: number;
  kakaoRate: number;
  notLinkedRate: number;
  marketingRate: number;
}