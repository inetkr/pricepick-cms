import React from 'react';
import type { Column } from 'src/components/common/table-pagination-row-per-page';
import { TablePaginationRowPerPage } from 'src/components/common/table-pagination-row-per-page';
import type { PaginationProps } from 'src/components/common/pagination';
import type { IGifticonProduct } from 'src/types/gifticon-products/gifticon_product';
import {
  apiTicketPriceToParts,
  formatGifticonSaleEndDate,
  formatGifticonTicketComboText,
  formatGifticonValidityDays,
} from 'src/utils/gifticon-products';

// ----------------------------------------------------------------------

interface GifticonProductTableProps {
  data: IGifticonProduct[];
  // 페이지가 아니라 전체 목록 기준 순번을 매기기 위한 시작 오프셋 (currentPage-1) * pageSize
  startIndex?: number;
  pagination?: PaginationProps;
  onRowClick?: (product: IGifticonProduct) => void;
  onToggleStatus?: (product: IGifticonProduct) => void;
  totalLabel?: string;
}

const ImagePlaceholder: React.FC = () => (
  <span
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '6px',
      border: '1px solid var(--border)',
      background: 'var(--surface-2)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#C9C2DC',
      flexShrink: 0,
    }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  </span>
);

// 포인츠허브 gipPriceHtml() 그대로: 등급.장수를 굵게 한 줄, 그 아래 회색으로 원화 병기.
// 환산값이 없으면(장수 0) 원화만 굵게 보여주고 그 아래 "(환산값 미설정)"을 빨간 글씨로 붙인다.
const ProductPriceCell: React.FC<{ product: IGifticonProduct }> = ({ product }) => {
  const parts = apiTicketPriceToParts(product.ticket_price);
  const hasPrice = product.price_won > 0;

  if (!hasPrice && parts.length === 0) {
    return <span style={{ color: 'var(--text-3)' }}>—</span>;
  }

  if (parts.length === 0) {
    return (
      <>
        <div className="gip-price-main">
          {hasPrice ? `${product.price_won.toLocaleString('ko-KR')}원` : '—'}
        </div>
        <div className="gip-price-none">(환산값 미설정)</div>
      </>
    );
  }

  return (
    <>
      <div className="gip-price-main">{formatGifticonTicketComboText(parts)}</div>
      {hasPrice && (
        <div className="gip-price-won">({product.price_won.toLocaleString('ko-KR')}원)</div>
      )}
    </>
  );
};

export const GifticonProductTable: React.FC<GifticonProductTableProps> = ({
  data,
  startIndex = 0,
  pagination,
  onRowClick,
  onToggleStatus,
  totalLabel,
}) => {
  const columns: Column<IGifticonProduct>[] = [
    {
      key: 'no',
      label: 'No',
      align: 'center',
      width: 56,
      render: (_item, index) => (
        <span style={{ color: 'var(--text-3)' }}>{startIndex + index + 1}</span>
      ),
    },
    {
      key: 'category_name',
      label: '카테고리',
      align: 'center',
      render: (item) => item.category_name,
    },
    {
      key: 'brand_name',
      label: '브랜드',
      align: 'center',
      render: (item) => <span style={{ fontWeight: 600 }}>{item.brand_name}</span>,
    },
    {
      key: 'image_url',
      label: '이미지',
      align: 'center',
      width: 70,
      render: (item) =>
        item.image_url ? (
          <img
            src={item.image_url}
            alt=""
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              display: 'inline-block',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <ImagePlaceholder />
        ),
    },
    {
      key: 'product_name',
      label: '상품명',
      align: 'center',
      render: (item) => (
        <span
          style={{
            fontWeight: 500,
            display: 'block',
            maxWidth: '260px',
            marginInline: 'auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={item.product_name}
        >
          {item.product_name}
        </span>
      ),
    },
    {
      key: 'product_code',
      label: '상품코드',
      align: 'center',
      render: (item) => (
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
          {item.product_code}
        </span>
      ),
    },
    {
      key: 'valid_end',
      label: '상품판매종료일',
      align: 'center',
      render: (item) => (
        <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
          {formatGifticonSaleEndDate(item.valid_end)}
        </span>
      ),
    },
    {
      key: 'provider_valid_days',
      label: '유효기간',
      align: 'center',
      render: (item) => (
        <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{item.provider_valid_days}</span>
      ),
    },
    {
      key: 'price_won',
      label: '판매가격',
      align: 'center',
      render: (item) => <ProductPriceCell product={item} />,
    },
    {
      key: 'is_active',
      label: '상태',
      align: 'center',
      render: (item) => (
        // 라벨을 누르면 실제 클릭은 span(tgl-sl)이나 label 자체에서 시작돼 행의 onClick까지
        // 버블링된다 — input에만 stopPropagation을 걸어서는 막히지 않아 상세 팝업이 같이
        // 열렸다. 라벨 자체에서 막는다. 라벨 안에 진짜 키보드 조작 가능한 input이 있어
        // 키보드 접근성은 그대로다 — 이 onClick은 새 상호작용이 아니라 버블링 차단용이다.
        // htmlFor/id와 중첩 모두로 연결돼 있지만 이 프로젝트 jsx-a11y 설정에서 오탐이 난다(최소 재현 확인).
        // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <label
          className="tgl"
          htmlFor={`gip-tgl-${item.id}`}
          title={item.is_active ? '판매중' : '판매중지'}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            id={`gip-tgl-${item.id}`}
            type="checkbox"
            checked={item.is_active}
            onChange={() => onToggleStatus?.(item)}
          />
          <span className="tgl-sl" />
        </label>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">상품 목록</div>
        <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
          {totalLabel ?? `총 ${data.length}개 상품`}
        </span>
      </div>
      <TablePaginationRowPerPage
        data={data}
        columns={columns}
        pagination={pagination}
        emptyMessage="등록된 상품이 없습니다."
        onRowClick={onRowClick}
      />
    </div>
  );
};
