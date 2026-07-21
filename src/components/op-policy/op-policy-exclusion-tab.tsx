import React from 'react';

export const OpPolicyExclusionTab: React.FC = () => (
  <div>
    <div className="card-header">
      <div className="card-title">적립 제외 카테고리</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>제외 카테고리</th>
          <th>사유</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>상품권 · 기프트카드</td>
          <td>현금성 상품 (재판매·부정 적립 방지)</td>
        </tr>
        <tr>
          <td>게임 아이템 · 게임머니</td>
          <td>현금성·환금성 상품</td>
        </tr>
        <tr>
          <td>디지털 콘텐츠 · 소프트웨어</td>
          <td>파트너스 적립 제외 대상</td>
        </tr>
      </tbody>
    </table>

    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' }}
    >
      <div className="policy-item">
        <div className="policy-label">개별 상품 제외</div>
        <div className="policy-value">운영자 지정</div>
        <div className="policy-desc">
          고가 가전 등 마진 이슈 상품. 앱에는 &quot;일부 고가 가전(운영자 지정)&quot;으로 통합 표시.
        </div>
      </div>
      <div className="policy-item">
        <div className="policy-label">제외 처리</div>
        <div className="policy-value">티켓 미지급</div>
        <div className="policy-desc">
          제외 대상 구매는 적립 계산에서 제외. 배송비·쿠폰·캐시도 계산 제외 후 산정.
        </div>
      </div>
    </div>

    <div className="info-box" style={{ marginTop: '14px' }}>
      제외 대상 카테고리·상품은 적립 계산에서 제외되며, 앱 10e 화면에 &quot;적립 제외 상품&quot;으로
      안내됩니다.
    </div>
  </div>
);
