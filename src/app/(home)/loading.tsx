// 메뉴를 누른 즉시 보여 주는 화면 — 다음 페이지를 서버에서 받아오는 동안 사이드바·헤더는 그대로 두고
// 본문 자리에 통계 카드·표 모양의 뼈대를 띄운다. 페이지가 준비되면 Next.js가 자동으로 바꿔 끼운다.
const STAT_CARDS = 3;
const TABLE_ROWS = 8;

export default function Loading() {
  return (
    <div className="section active" aria-busy="true" aria-label="페이지 불러오는 중">
      <div className="stats-grid">
        {Array.from({ length: STAT_CARDS }, (_, i) => (
          <div key={i} className="card pg-skel-card">
            <div className="pg-skel" style={{ width: '40%', height: 12 }} />
            <div className="pg-skel" style={{ width: '55%', height: 26, marginTop: 12 }} />
            <div className="pg-skel" style={{ width: '30%', height: 10, marginTop: 10 }} />
          </div>
        ))}
      </div>

      <div className="card pg-skel-card" style={{ marginTop: 16 }}>
        <div className="pg-skel" style={{ width: 160, height: 16, marginBottom: 18 }} />
        {Array.from({ length: TABLE_ROWS }, (_, i) => (
          <div key={i} className="pg-skel-row">
            <div className="pg-skel" style={{ flex: 2 }} />
            <div className="pg-skel" style={{ flex: 1 }} />
            <div className="pg-skel" style={{ flex: 1 }} />
            <div className="pg-skel" style={{ flex: 1 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
