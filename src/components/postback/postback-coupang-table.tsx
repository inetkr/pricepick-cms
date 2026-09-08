'use client';

import React, { useState } from 'react';
import {
  PbCaret,
  PbLinesTable,
  PbMoney,
  PbNone,
  PbRaw,
  PbRawFields,
  PbTimeCell,
} from 'src/components/postback/postback-cells';
import { PostbackPagination } from 'src/components/postback/postback-pagination';
import type { IPostbackCoupangFilters, IPostbackLog } from 'src/types/postback/postback';
import { PB_KIND_BADGE, pbCoupangPidKey, pbField, pbN, pbPayloadEntries } from 'src/utils/postback';

const COL_SPAN = 8;

interface PostbackCoupangTableProps {
  rows: IPostbackLog[];
  count: number;
  isLoading: boolean;
  draft: IPostbackCoupangFilters;
  onDraftChange: (patch: Partial<IPostbackCoupangFilters>) => void;
  onApplySearch: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* 펼치면 나오는 두 가지 — 위는 수신 원문(payload) 그대로이고, 아래는 주문 줄(lines) 표다.
   둘 다 칸을 못 박지 않는다: 이번 건에 안 온 키는 자리도 만들지 않고, 새로 붙은 키는 그냥 나온다.
   lines 는 서버가 order_detail 을 정리해 준 것이라 원문 칸에서는 order_detail 을 빼 두었다 —
   구매는 productid, 취소는 productId 로 온다는 것은 접힌 줄의 상품번호 밑에 그대로 적힌다. */
const PbCoupangDetail: React.FC<{ row: IPostbackLog }> = ({ row }) => (
  <tr className="pb-detail">
    <td colSpan={COL_SPAN}>
      <PbRawFields pairs={pbPayloadEntries(row.payload)} />
      <PbLinesTable rowId={row.id} lines={row.lines} />
    </td>
  </tr>
);

/* 쿠팡 포스트백 로그 — 받은 값을 받은 그대로 본다.
   접힌 줄에는 찾을 때 쓰는 값(주문번호·상품번호)까지 두고, 상품명처럼 긴 것과
   수신 원문 전체는 펼침으로 내렸다. 머리글 밑의 작은 글씨가 그 칸의 수신 필드 이름이다. */
export const PostbackCoupangTable: React.FC<PostbackCoupangTableProps> = ({
  rows,
  count,
  isLoading,
  draft,
  onDraftChange,
  onApplySearch,
  page,
  totalPages,
  onPageChange,
}) => {
  // 여러 줄을 동시에 펼쳐 놓고 견줄 일이 있어 하나만 열리게 막지 않는다
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div id="pb-tab-coupang">
      {/* 손댄 값은 여기 쌓이기만 한다 — 서버로 나가는 것은 「검색」을 누를 때 한 번뿐이다 */}
      <div className="toolbar">
        <input
          className="search-box"
          placeholder="주문번호·상품 검색"
          value={draft.search}
          onChange={(e) => onDraftChange({ search: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onApplySearch();
          }}
        />
        <select
          className="filter-sel"
          value={draft.kind}
          onChange={(e) =>
            onDraftChange({ kind: e.target.value as IPostbackCoupangFilters['kind'] })
          }
        >
          <option value="ALL">전체</option>
          <option value="PURCHASE">purchase</option>
          <option value="CANCEL">cancel</option>
        </select>
        <button type="button" className="btn btn-primary btn-sm" onClick={onApplySearch}>
          검색
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">쿠팡 포스트백 로그</div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{pbN(count)}건</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>
                구매 시각
                <span className="fk">purchase_time</span>
              </th>
              <th>
                구분
                <span className="fk">purchase_cancel</span>
              </th>
              <th>
                회원
                <span className="fk">subid</span>
              </th>
              <th>
                주문번호
                <span className="fk">orderId</span>
              </th>
              <th>
                상품번호
                <span className="fk">productid</span>
              </th>
              <th>
                수량
                <span className="fk">quantity</span>
              </th>
              <th>
                금액
                <span className="fk">payment</span>
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
                const p = r.payload ?? {};
                // 구분은 수신 원문 그대로 — 머리글이 purchase_cancel 이라 그 값을 적는다
                const kind = pbField(p, 'purchase_cancel') || r.action;
                const kindLower = kind.toLowerCase();
                const isCancel = kindLower === 'cancel';
                const open = Boolean(openIds[r.id]);
                const first = r.lines?.[0];
                const rest = (r.line_count ?? r.lines?.length ?? 0) - 1;
                const matched = r.matched_line_count;
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
                      <td>
                        {kind ? (
                          <span className={PB_KIND_BADGE[kindLower] || 'badge badge-gray'}>
                            {kind}
                          </span>
                        ) : (
                          <PbNone />
                        )}
                      </td>
                      <td>
                        <div className="pb-uid" title={r.sub_id ?? ''}>
                          <PbRaw value={r.sub_id} />
                        </div>
                      </td>
                      <td>
                        <div className="pb-ord" title={r.order_code ?? ''}>
                          <PbRaw value={r.order_code} />
                        </div>
                      </td>
                      <td>
                        {first ? (
                          <>
                            <div className="pb-pid">
                              <PbRaw value={first.product_code} />
                            </div>
                            <div className="pb-raw">{pbCoupangPidKey(p, 0)}</div>
                            {rest > 0 && <div className="pb-dim">외 {rest}건</div>}
                            {/* 취소 ↔ 전 구매가 짝지어진 건이라는 표시. 연결까지가 전부다. */}
                            {Boolean(matched) && (
                              <div className="pb-dim">
                                {isCancel ? '전 구매 연결' : '취소 연결'} {matched}건
                              </div>
                            )}
                          </>
                        ) : (
                          <PbNone />
                        )}
                      </td>
                      <td>
                        <PbRaw value={r.total_quantity} />
                      </td>
                      <td>
                        <PbMoney value={r.total_amount} />
                      </td>
                      <PbCaret />
                    </tr>
                    {open && <PbCoupangDetail row={r} />}
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
