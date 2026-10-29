// 연속구매 미션 — 조회 전용. 지금 적용 중인 미션 단계와 규칙을 보여 준다.
// 미션 설정 API가 아직 없어 화면에 적힌 값은 운영 정책 그대로 둔 고정값이다.

type IStreakMissionStage = {
  stage: number;
  purchaseCount: number;
  withinDays: number;
  eventTickets: number;
};

const STREAK_MISSION_STAGES: IStreakMissionStage[] = [
  { stage: 1, purchaseCount: 3, withinDays: 7, eventTickets: 1 },
  { stage: 2, purchaseCount: 5, withinDays: 14, eventTickets: 3 },
  { stage: 3, purchaseCount: 10, withinDays: 30, eventTickets: 5 },
];

// 확정 구매 사이 간격이 이 일수를 넘으면 연속이 끊긴다
const STREAK_MAX_GAP_DAYS = 7;
// 앱 홈에 보여 주는 최대 보상 장수 (마지막 단계 보상)
const APP_HOME_MAX_TICKETS = Math.max(...STREAK_MISSION_STAGES.map((s) => s.eventTickets));

export const StreakMissionSection = () => (
  <div className="section active" id="sec-streak-mission">
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">현재 적용 중인 미션</div>
          <div className="card-sub">조회 전용</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>단계</th>
            <th>연속 구매 횟수</th>
            <th>기간</th>
            <th>보상</th>
          </tr>
        </thead>
        <tbody>
          {STREAK_MISSION_STAGES.map((s) => (
            <tr key={s.stage}>
              <td style={{ textAlign: 'center' }}>{s.stage}단계</td>
              <td style={{ textAlign: 'center' }}>{s.purchaseCount}회</td>
              <td style={{ textAlign: 'center' }}>{s.withinDays}일 내</td>
              <td style={{ textAlign: 'center' }}>이벤트 티켓 {s.eventTickets}장</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="card" style={{ marginTop: '16px' }}>
      <div className="policy-item">
        <div className="policy-label">연속 인정</div>
        <div className="policy-value">확정 구매 사이 간격 {STREAK_MAX_GAP_DAYS}일 이내</div>
      </div>
      <div className="policy-item">
        <div className="policy-label">앱 홈 표시</div>
        <div className="policy-value">최대 {APP_HOME_MAX_TICKETS}장</div>
      </div>
    </div>
  </div>
);
