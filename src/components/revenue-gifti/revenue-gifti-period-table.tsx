'use client';

import React from 'react';
import { GsTicketCell } from 'src/components/revenue-gifti/revenue-gifti-cells';
import type { IGiftiRevenuePeriodRow } from 'src/types/revenue/revenue_gifti';
import { gsN, gsWon } from 'src/utils/revenue-gifti';

interface RevenueGiftiPeriodRowsProps {
  rows: IGiftiRevenuePeriodRow[];
  isLoading: boolean;
  onDrill: (row: IGiftiRevenuePeriodRow) => void;
}

/* Monthly/daily table — the period cell shows the received value as-is (not
   reformatted). No total row here: this table answers "which period sold the most",
   not "what's the grand total" (the stat cards above already show that). That a row
   can be drilled into is signaled only by color and cursor. */
export const RevenueGiftiPeriodRows: React.FC<RevenueGiftiPeriodRowsProps> = ({
  rows,
  isLoading,
  onDrill,
}) => (
  <table id="gs-bd-table">
    <colgroup>
      <col style={{ width: '22%' }} />
      <col style={{ width: '14%' }} />
      <col style={{ width: '34%' }} />
      <col style={{ width: '30%' }} />
    </colgroup>
    <thead>
      <tr>
        <th>기간</th>
        <th>판매 건수</th>
        <th>소진 티켓</th>
        <th>원화 환산액</th>
      </tr>
    </thead>
    <tbody>
      {!rows.length ? (
        <tr>
          <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
            {isLoading ? '불러오는 중…' : '해당 기간에 판매가 없습니다.'}
          </td>
        </tr>
      ) : (
        rows.map((row) => (
          <tr key={row.period}>
            {/* A button covering the whole cell — putting a role on the td would make it
                clickable by eye only, unreachable by keyboard */}
            <td>
              <button type="button" className="gs-drillable" onClick={() => onDrill(row)}>
                {row.period}
              </button>
            </td>
            <td>{gsN(row.sold_count)}</td>
            <td>
              <GsTicketCell counts={row.tickets_used} won={row.total_won} />
            </td>
            <td style={{ fontWeight: 600 }}>{gsWon(row.total_won)}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);
