import React from 'react';
import { Modal } from 'src/components/common/modal';

interface PostbackNoticeModalProps {
  open: boolean;
  onClose: () => void;
}

/* 화면에서 걷어낸 설명을 여기 담는다 — 화면에는 값만 두고, 왜 그런지는 이 모달로 들어온다.
   적는 것은 「제휴사가 무엇을 어떤 이름으로 보내오는가」뿐이다: 화면 조작법이나 우리 쪽 사정은
   제휴사 규격이 아니라서 여기 두지 않는다. 특히 「commision」과 두 제휴사의 필드가 하나도
   겹치지 않는다는 점은 오해받기 쉬워 못 박아 둔다. */
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
          제휴사가 보내온 포스트백을 <strong>받은 값 그대로</strong> 확인하는 화면입니다. 계산해서
          만든 값은 넣지 않습니다.
        </li>
        <li>
          <span className="k">쿠팡 · 링크프라이스 분리</span>두 제휴사는 API 규격이 달라 별도
          블록·별도 컬럼으로 봅니다.
        </li>
        <li>
          <span className="k">쿠팡 수신 필드</span>
          afcode · subid · os · adid · subparam · purchase_time · orderId · purchase_cancel ·
          order_detail[]
        </li>
        <li>
          <span className="k">쿠팡 order_detail</span>
          productid(구매) / productId(취소) · productName · payment · quantity. 상품번호 키가
          구매/취소에서 다릅니다.
        </li>
        <li>
          <span className="k">쿠팡 대사 표시</span>
          같은 orderId · 같은 상품번호로 구매·취소 포스트백을 짝지어 보여 줍니다. 연결까지이고
          금액은 계산하지 않습니다.
        </li>
        <li>
          <span className="k">링크프라이스 수신 필드 16개</span>
          day · time · merchant_id · order_code · product_code · product_name · category_code ·
          item_count · price · commision · affiliate_user_id · base_commission ·
          incentive_commission · trlog_id · uniq_id · affiliate_id. 쿠팡과 겹치는 필드가 없습니다.
        </li>
        <li>
          <span className="k">링크프라이스 수신 단위</span>
          상품 1건당 1콜백입니다. order_detail 같은 배열이 없고, 한 주문에 상품이 여럿이면
          order_code · uniq_id 가 같은 건이 상품 수만큼 따로 옵니다.
        </li>
        <li>
          <span className="k">commision</span>
          철자가 commission이 아닙니다 — 링크프라이스 원문 그대로입니다. 링크프라이스가 수수료{' '}
          <strong>금액</strong>을 직접 보내 주며, base_commission · incentive_commission 도 받은
          값입니다.
        </li>
        <li>
          <span className="k">링크프라이스 취소</span>
          취소 포스트백이 어떤 모양으로 오는지 아직 확인되지 않았습니다. 확인 전까지 취소 관련
          표시를 두지 않습니다.
        </li>
      </ul>
    </div>
  </Modal>
);
