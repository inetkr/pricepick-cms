import React from 'react';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

interface DateTimeCellProps {
  value: string | null;
  emptyText?: string;
}

// 목록 표의 "구매일"·"상태변경일" 류 — 날짜(굵게)와 시각(회색)을 두 줄로 나눠 보여준다.
export const DateTimeCell: React.FC<DateTimeCellProps> = ({ value, emptyText = '—' }) => {
  const d = value ? dayjs(value) : null;
  if (!d || !d.isValid()) {
    return <span style={{ color: 'var(--text-3)' }}>{emptyText}</span>;
  }
  return (
    <div>
      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{d.format('YYYY/MM/DD')}</div>
      <div className="cell-sub">{d.format('HH:mm:ss')}</div>
    </div>
  );
};
