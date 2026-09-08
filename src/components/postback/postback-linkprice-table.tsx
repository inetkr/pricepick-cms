'use client';

import React, { useState } from 'react';
import {
  PbCaret,
  PbLinesTable,
  PbMoney,
  PbRaw,
  PbRawFields,
  PbTimeCell,
} from 'src/components/postback/postback-cells';
import { PostbackPagination } from 'src/components/postback/postback-pagination';
import type {
  IPostbackLinkpriceFilters,
  IPostbackLog,
  IPostbackMerchantOption,
} from 'src/types/postback/postback';
import { pbN, pbPayloadEntries } from 'src/utils/postback';

const COL_SPAN = 9;

interface PostbackLinkpriceTableProps {
  rows: IPostbackLog[];
  count: number;
  isLoading: boolean;
  draft: IPostbackLinkpriceFilters;
  onDraftChange: (patch: Partial<IPostbackLinkpriceFilters>) => void;
  onApplySearch: () => void;
  merchantOptions: IPostbackMerchantOption[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* 펼치면 나오는 두 가지 — 위는 수신 원문(payload) 그대로이고, 아래는 주문 줄(lines) 표다.
   건마다 오는 키가 다르다: 이 화면이 본 것만도 time·category_code·base_commission·
   incentive_commission·affiliate_id 가 통째로 빠진 건이 있다. 칸을 못 박아 두면
   그런 건에서 있지도 않은 자리가 빈칸으로 남고, 새로 붙은 키는 아예 안 보인다. */
const PbLinkpriceDetail: React.FC<{ row: IPostbackLog }> = ({ row }) => (
  <tr className="pb-detail">
    <td colSpan={COL_SPAN}>
      <PbRawFields pairs={pbPayloadEntries(row.payload)} />
      <PbLinesTable rowId={row.id} lines={row.lines} />
    </td>
  </tr>
);

/* 링크프라이스 포스트백 로그 — 포스트백 1건 = 1줄.
   상품 1건당 1콜백이라 한 주문에 상품이 여럿이면 order_code 가 같은 건이 여러 줄로 온다.
   묶는 것은 적립 계산 쪽 일이고 이 화면은 온 그대로 둔다.
   쿠팡과 수신 필드가 하나도 겹치지 않아 표를 갈라 놓았다 — 머리글 밑 작은 글씨가 그 증거다. */
export const PostbackLinkpriceTable: React.FC<PostbackLinkpriceTableProps> = ({
  rows,
  count,
  isLoading,
  draft,
  onDraftChange,
  onApplySearch,
  merchantOptions,
  page,
  totalPages,
  onPageChange,
}) => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div id="pb-tab-linkprice">
      {/* 손댄 값은 여기 쌓이기만 한다 — 서버로 나가는 것은 「검색」을 누를 때 한 번뿐이다 */}
      <div className="toolbar">
        <input
          className="search-box"
          placeholder="주문코드·상품코드 검색"
          value={draft.search}
          onChange={(e) => onDraftChange({ search: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onApplySearch();
          }}
        />
        <select
          className="filter-sel"
          value={draft.merchantId}
          onChange={(e) => onDraftChange({ merchantId: e.target.value })}
        >
          <option value="">전체</option>
          {/* 코드(value)로 거르고 이름(label)을 보인다 — 서버가 준 목록 그대로다 */}
          {merchantOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-primary btn-sm" onClick={onApplySearch}>
          검색
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">링크프라이스 포스트백 로그</div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{pbN(count)}건</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>
                주문 일시
                <span className="fk">day · time</span>
              </th>
              <th>
                머천트
                <span className="fk">merchant_id</span>
              </th>
              <th>
                회원
                <span className="fk">affiliate_user_id</span>
              </th>
              <th>
                주문코드
                <span className="fk">order_code</span>
              </th>
              <th>
                상품코드
                <span className="fk">product_code</span>
              </th>
              <th>
                수량
                <span className="fk">item_count</span>
              </th>
              <th>
                구매금액
                <span className="fk">price</span>
              </th>
              <th>
                수수료
                <span className="fk">commision</span>
              </th>
              <th aria-label="펼치기" />
            </tr>
          </thead>
          <tbody>
            {isLoading || rows.length === 0 ? (
              <tr>
                <td
                  colSpan={COL_SPAN}
                  style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}
                >
                  {isLoading ? '불러오는 중…' : '0건'}
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const open = Boolean(openIds[r.id]);
                const first = r.lines?.[0];
                return (
                  <React.Fragment key={r.id}>
                    <tr
                      className="pb-row"
                      aria-expanded={open}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(r.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggle(r.id);
                        }
                      }}
                    >
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <PbTimeCell row={r} />
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        <PbRaw value={r.merchant_code} />
                      </td>
                      <td>
                        <div className="pb-uid" title={r.user_id ?? ''}>
                          <PbRaw value={r.user_id} />
                        </div>
                      </td>
                      <td>
                        <div className="pb-ord" title={r.order_code ?? ''}>
                          <PbRaw value={r.order_code} />
                        </div>
                      </td>
                      <td className="pb-pid">
                        <PbRaw value={first?.product_code} />
                      </td>
                      <td>
                        <PbRaw value={r.total_quantity} />
                      </td>
                      <td>
                        <PbMoney value={r.total_amount} />
                      </td>
                      {/* 링크프라이스가 수수료 금액을 직접 보내 준다 — 화면에서 계산한 값이 아니다 */}
                      <td>
                        <PbMoney value={r.total_commission} />
                      </td>
                      <PbCaret />
                    </tr>
                    {open && <PbLinkpriceDetail row={r} />}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
        <PostbackPagination page={page} totalPages={totalPages} onChange={onPageChange} />
      </div>
    </div>
  );
};
