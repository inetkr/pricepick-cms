import React from 'react';
import dayjs from 'dayjs';
import type { IGifticonBulkHistoryEntry } from 'src/types/gifticon-bulk/gifticon_bulk';

// ----------------------------------------------------------------------

interface BulkHistoryTableProps {
  data: IGifticonBulkHistoryEntry[];
}

export const BulkHistoryTable: React.FC<BulkHistoryTableProps> = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th style={{ width: '150px' }}>일시</th>
        <th>파일</th>
        <th style={{ width: '90px' }}>총</th>
        <th style={{ width: '90px' }}>성공</th>
        <th style={{ width: '90px' }}>실패</th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <tr>
          <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>
            No data
          </td>
        </tr>
      ) : (
        data.map((h) => (
          <tr key={h.id}>
            <td style={{ textAlign: 'center' }}>{dayjs(h.createdAt).format('YYYY/MM/DD HH:mm')}</td>
            <td>{h.fileName}</td>
            <td style={{ textAlign: 'center' }}>{h.total}</td>
            <td style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 700 }}>{h.ok}</td>
            <td
              style={{
                textAlign: 'center',
                color: h.fail ? 'var(--danger)' : 'var(--text-3)',
                fontWeight: 700,
              }}
            >
              {h.fail}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);
