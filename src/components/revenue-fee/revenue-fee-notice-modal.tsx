import React from 'react';
import { Modal } from 'src/components/common/modal';

interface RevenueFeeNoticeModalProps {
  open: boolean;
  onClose: () => void;
}

// 화면에서 걷어낸 설명을 여기 담는다 — 화면에는 값만 두고, 왜 그런지는 이 모달로 들어온다.
export const RevenueFeeNoticeModal: React.FC<RevenueFeeNoticeModalProps> = ({ open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="제휴 수수료 매출 Notice"
    width="520px"
    footer={
      <button type="button" className="btn btn-primary" onClick={onClose}>
        닫기
      </button>
    }
  >
    <div className="modal-body">
      <ul className="ta-notice-list">
        <li>
          <span className="k">수익</span>
          수수료 − 유저 적립. 적립률만큼은 유저에게 넘어갑니다.
        </li>
        <li>
          <span className="k">수수료율 · 적립률</span>
          <strong>티켓 적립 설정</strong>의 값을 그대로 씁니다.
        </li>
        <li>
          <span className="k">지급 대기 · 지급 완료</span>
          구매하면 랜덤 티켓이 <strong>지급 대기</strong>로 잡히고, 대기일 수가 지나면 등급 티켓{' '}
          <strong>지급 완료</strong>가 됩니다 — 쿠팡은 카카오톡 연동 D+7 / 미연동 D+30,
          링크프라이스는 몰별 전환 대기일 수(기본 30일).
        </li>
        <li>
          <span className="k">취소 · 취소(환수)</span>
          지급 대기 중에 취소하면 <strong>취소</strong>(받은 게 없으니 없던 일), 지급 완료 뒤에
          취소하면 <strong>취소(환수)</strong>(이미 받은 티켓을 도로 뺍니다). 둘 다 합계에서 뺍니다.
        </li>
        <li>
          <span className="k">한도 초과 · 일부 지급 · 미지급</span>
          하루/한 달 적립 한도에 걸려 티켓이 안 나갔거나(<strong>한도 초과</strong>) 일부만 나간 (
          <strong>일부 지급</strong>) 건입니다. 구매는 살아 있어 수수료는 들어오지만 유저는 다 못
          받으므로, 이 줄이 늘면 한도를 손볼지 판단해야 합니다. <strong>미지급</strong>은 애초에 줄
          대상이 아니었던 건입니다.
        </li>
        <li>
          <span className="k">쿠팡 주문 건수</span>
          주문번호가 오지 않아 결제 건 하나를 주문 한 건으로 셉니다. 적립 지급 건수는 우리 DB
          기준이라 1:1로 안 맞습니다.
        </li>
        <li>
          <span className="k">쿠팡 전환 대기일 수</span>
          <span>카카오톡 연동 D+7 / 미연동 D+30</span>. <strong>고정값입니다.</strong>
        </li>
        <li>
          <span className="k">쿠팡은 별도</span>
          쿠팡은 링크프라이스가 아니라 직접 제휴라 표를 갈라 놓습니다. 위 요약 카드 다섯 장이 둘을
          합친 값입니다.
        </li>
        <li>
          <span className="k">월 줄 누르기</span>
          <strong>제휴몰별</strong> 탭이 그 달로 좁혀집니다.
        </li>
      </ul>
    </div>
  </Modal>
);
