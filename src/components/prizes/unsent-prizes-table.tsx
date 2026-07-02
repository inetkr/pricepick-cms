// src/components/prizes/UnsentPrizesTable.tsx
import React from 'react';
import type { Column} from '../common/table';
import { Table } from '../common/table';

interface UnsentPrize {
  nickname: string;
  kakaoId: string;
  prize: string;
  winDate: string;
  winTime: string;
}

interface UnsentPrizesTableProps {
  data: UnsentPrize[];
  onSendPrize: (item: UnsentPrize) => void;
}

export const UnsentPrizesTable: React.FC<UnsentPrizesTableProps> = ({ data, onSendPrize }) => {
  const columns: Column<UnsentPrize>[] = [
    {
      key: 'nickname',
      label: '닉네임',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 500 }}>{item.nickname}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
            ({item.kakaoId})
          </div>
        </div>
      ),
    },
    {
      key: 'prize',
      label: '경품',
    },
    {
      key: 'winDate',
      label: '당첨일',
      render: (item) => (
        <div style={{ color: 'var(--text-3)' }}>
          <div style={{ fontWeight: 700, color: '#333333' }}>{item.winDate}</div>
          <div>{item.winTime}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '처리',
      render: (item) => (
        <button type="button" className="btn btn-primary btn-sm" onClick={() => onSendPrize(item)}>
          발송
        </button>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">미발송 경품</div>
      </div>
      <Table data={data} columns={columns} />
    </div>
  );
};
