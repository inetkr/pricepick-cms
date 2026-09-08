import React from 'react';
import { Modal } from 'src/components/common/modal';

interface PostbackNoticeModalProps {
  open: boolean;
  onClose: () => void;
}

/* 화면에서 걷어낸 설명을 여기 담는다 — 화면에는 값만 두고, 왜 그런지는 이 모달로 들어온다.
   특히 「commision」과 「수신 시각 ≠ 주문 시각」은 오해받기 쉬워 여기 못 박아 둔다. */
export const PostbackNoticeModal: React.FC<PostbackNoticeModalProps> = ({ open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="포스트백 로그 Notice"
    width="560px"
    footer={
      <button type="button" className="btn btn-primary" onClick={onClose}>
        닫기
      </button>
    }
  >
    <div className="modal-body">
      <ul className="ta-notice-list">
        <li>
          <span className="k">이 화면</span>
          제휴사가 보내온 포스트백을 <strong>받은 값 그대로</strong> 확인하는 화면입니다. 줄을
          누르면 수신 원문(payload)이 그대로 펼쳐집니다. 제휴 수수료 매출·환수 금액·적립 예상 같은
          계산된 값은 여기 두지 않습니다. 펼침에 뜨는 키는 <strong>이번 건에 실제로 온 키</strong>
          뿐이라 건마다 다릅니다 — 안 온 키는 자리도 만들지 않습니다. 펼침은 위가 수신
          원문(payload), 아래가 주문 줄(lines) 표이며, 표의 칸 이름이 곧 서버가 준 키입니다.
        </li>
        <li>
          <span className="k">쿠팡 · 링크프라이스 분리</span>두 제휴사는 수신 필드가 하나도 겹치지
          않습니다. 서버가 정리해 준 값은 같은 규격이지만 어느 수신 필드에서 왔는지가 서로 달라 표를
          갈라 두었습니다 — 머리글 밑 작은 글씨가 그 수신 필드 이름입니다.
        </li>
        <li>
          <span className="k">수신 시각 ≠ 주문 시각</span>큰 글씨는 제휴사가 보낸 주문 시각(쿠팡
          purchase_time · 링크프라이스 day+time)이고, 그 밑이 원문 문자열입니다. 링크프라이스가 day
          만 보낸 건은 <strong>시각 줄을 비웁니다</strong> — 00:00:00 으로 메우면 받지도 않은 값을
          적는 셈입니다. 제휴사가 시각을 아예 안 보냈을 때만 우리가 받은 시각(created_at)으로
          넘어가며, 그럴 땐 「수신 시각」이라고 적힙니다.
        </li>
        <li>
          <span className="k">링크프라이스 수신 단위</span>
          상품 1건당 1콜백입니다. 한 주문에 상품이 여럿이면 order_code 가 같은 건이 상품 수만큼 따로
          오며, 묶지 않고 온 그대로 한 줄씩 둡니다.
        </li>
        <li>
          <span className="k">commision</span>
          철자가 commission이 아닙니다 — 링크프라이스 원문 그대로입니다. 링크프라이스가 수수료{' '}
          <strong>금액</strong>을 직접 보내 주며, 화면에서 계산한 값이 아닙니다.
        </li>
        <li>
          <span className="k">대사(matched)</span>
          취소 ↔ 전 구매 짝짓기는 서버가 합니다. 쿠팡 건은 금액 칸 밑에{' '}
          <strong>전 구매 연결 N건</strong>(취소가 아니면 「취소 연결 N건」)으로 적고, 줄별 결과는
          펼침의 주문 줄 표 matched 칸에 원문 그대로 적힙니다.
        </li>
        <li>
          <span className="k">검색어</span>
          상품명 · 주문번호 · 회원 ID · subid · 머천트 코드 · 상품 코드를 함께 훑습니다.
        </li>
        <li>
          <span className="k">조건은 「검색」을 눌러야 나갑니다</span>
          검색어든 고르는 칸이든 손댄 값은 칸에만 남아 있다가 <strong>「검색」을 누를 때</strong>
          한꺼번에 나갑니다(검색 칸에서 Enter 도 같습니다). 고르는 즉시 조회하지 않으므로, 검색어와
          구분을 함께 바꾸려던 사이에 쓸데없는 조회가 끼어들지 않습니다. 조건이 그대로여도 누르면
          <strong>다시 불러옵니다</strong> — 그 사이 들어온 포스트백은 그때 보입니다.
        </li>
        <li>
          <span className="k">서버가 거르는 것</span>
          검색어와 구분(PURCHASE/CANCEL), 그리고 쪽나눔뿐입니다 — 서버가 받는 것이 그것뿐입니다.
          처리 결과·기간으로는 <strong>거를 수 없습니다</strong>.
        </li>
        <li>
          <span className="k">링크프라이스 머천트 칸</span>
          고를 거리는 서버가 따로 내려 준 머천트 목록입니다(코드로 거르고 이름을 보입니다). 목록이
          제휴사별로 갈려 오지 않아 쿠팡 머천트도 함께 들어 있습니다. 거르는 일은 서버가
          merchant_code 를 안 받아 여전히 화면 몫이라
          <strong>지금 보고 있는 쪽 안에서만</strong> 걸립니다 — 목록에 있어도 이 쪽에 안 온
          머천트를 고르면 0건이 됩니다. 그 머천트가 없는 것이 아니라 이 쪽에 없는 것입니다.
        </li>
      </ul>
    </div>
  </Modal>
);
