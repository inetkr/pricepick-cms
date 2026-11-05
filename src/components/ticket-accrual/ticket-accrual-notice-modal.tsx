import React from 'react';
import { Modal } from 'src/components/common/modal';
import { DEFAULT_ACCRUAL_RATIO } from 'src/utils/ticket-accrual';

interface TicketAccrualNoticeModalProps {
  open: boolean;
  onClose: () => void;
}

// 티켓 적립 설정 화면 상단의 "?" 안내 버튼이 여는 상세 설명 모달 — 두 테이블(대표 제휴몰·
// 제휴몰(링크프라이스))에 공통으로 적용되는 규칙을 한곳에 모아 둔다. 화면 자체에는 매번 다시
// 적기 번잡한 내용(쿠팡 전환 대기일 수, 링크프라이스 지급 시점, 티켓 환산 방식 등)이라 별도 모달로 뺐다.
export const TicketAccrualNoticeModal: React.FC<TicketAccrualNoticeModalProps> = ({
  open,
  onClose,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="티켓 적립 설정 Notice"
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
          <span className="k">수수료 · 적립률</span>
          제휴몰별로 정합니다. 적립률 기본값은 수수료의 {DEFAULT_ACCRUAL_RATIO}%이고, 남는{' '}
          {100 - DEFAULT_ACCRUAL_RATIO}%가 우리 수익입니다.
        </li>
        <li>
          <span className="k">쿠팡</span>
          대표 제휴몰로 목록과 별도 표시됩니다.
        </li>
        <li>
          <span className="k">쿠팡 전환 대기일 수</span>
          카카오톡 연동 D+7 / 미연동 D+30. <b>고정값이라 수정할 수 없습니다.</b>
        </li>
        <li>
          <span className="k">링크프라이스</span>
          구매월 기준 익익월 6일 확정 후 지급
        </li>
        <li>
          <span className="k">티켓 환산</span>
          적립액 ÷ 티켓 1장 값, 남는 잔돈은 버립니다.
        </li>
      </ul>
    </div>
  </Modal>
);
