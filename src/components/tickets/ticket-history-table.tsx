// src/components/tickets/TicketHistoryTable.tsx
import React from 'react';

interface TicketHistoryItem {
  nickname: string;
  uid: string;
  reason: string;
  ticketType: string;
  ticketDetail: string;
  date: string;
  time: string;
}

interface TicketHistoryTableProps {
  data: TicketHistoryItem[];
  title?: string;
  totalLabel?: string;
}

const getTicketColor = (type: string) => {
  if (type.includes('골드')) return 'gold';
  if (type.includes('실버')) return 'silver';
  if (type.includes('브론즈')) return 'bronze';
  if (type.includes('랜덤')) return 'random';
  if (type.includes('이벤트')) return 'event';
  return '';
};

const getReasonColor = (reason: string) => {
  if (reason.includes('전환')) return 'var(--success)';
  if (reason.includes('대기')) return 'var(--text-2)';
  if (reason.includes('소모')) return 'var(--danger)';
  if (reason.includes('회수')) return 'var(--danger)';
  if (
    reason.includes('미션') ||
    reason.includes('출석') ||
    reason.includes('광고') ||
    reason.includes('초대')
  )
    return '#c084fc';
  if (reason.includes('관리자')) return 'var(--main)';
  return 'var(--text-2)';
};

const columns = [
  {
    key: 'nickname',
    label: '닉네임(카카오톡 ID)',
    render: (item: TicketHistoryItem) => (
      <div>
        <div style={{ fontWeight: 500 }}>{item.nickname}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
          ({item.uid})
        </div>
      </div>
    ),
  },
  {
    key: 'reason',
    label: '사유',
    render: (item: TicketHistoryItem) => (
      <span style={{ color: getReasonColor(item.reason) }}>{item.reason}</span>
    ),
  },
  {
    key: 'ticketDetail',
    label: '티켓',
    render: (item: TicketHistoryItem) => (
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {item.ticketDetail.split(',').map((part, idx) => {
          const clean = part.trim();
          const isNegative = clean.startsWith('-');
          const type = getTicketColor(clean);
          const cls = type ? `tk-chip ${type} bare` : 'tk-chip bare';
          const style = isNegative ? { color: 'var(--danger)' } : {};
          return (
            <span key={idx} className={cls} style={style}>
              {clean}
            </span>
          );
        })}
      </div>
    ),
  },
  {
    key: 'date',
    label: '일시',
    render: (item: TicketHistoryItem) => (
      <div
        style={{
          color: 'var(--text-3)',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        <div style={{ fontWeight: 700, color: '#333333' }}>{item.date}</div>
        <div>{item.time}</div>
      </div>
    ),
  },
];

export const TicketHistoryTable: React.FC<TicketHistoryTableProps> = ({
  data,
  title = '최근 티켓 이력',
  totalLabel,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>
          오늘 {data.length}건 · 합 {totalLabel || ''}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ textAlign: 'center' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              {columns.map((col) => {
                const value = item[col.key as keyof TicketHistoryItem];
                return (
                  <td key={String(col.key)} style={{ textAlign: 'center' }}>
                    {col.render ? col.render(item) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button type="button" className="page-btn active">
          1
        </button>
        <button type="button" className="page-btn">
          2
        </button>
        <button type="button" className="page-btn">
          ···
        </button>
        <button type="button" className="page-btn">
          ›
        </button>
      </div>
    </div>
  );
};
