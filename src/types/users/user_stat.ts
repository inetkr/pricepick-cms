// GET /user/admin/stats — 카카오 연동·미연동·마케팅 동의는 정상 회원 기준 집계
export type IUserStat = {
    total_users: number;
    total_normal_users: number;
    total_blocked_users: number;
    total_deleted_users: number;
    total_kakao_linked: number;
    total_kakao_not_linked: number;
    total_marketing_consent: number;
}
