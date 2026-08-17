import React from 'react';
import type { Column } from 'src/components/common/table';
import { Table } from 'src/components/common/table';
import {
  AccrualRateCell,
  FeeRateCell,
  LogoCell,
  MarginCell,
  SimulatorButtonCell,
} from 'src/components/ticket-accrual/ticket-accrual-rate-cells';
import type { IAffiliateMall } from 'src/types/config/ticket_accrual_config';

interface TicketAccrualPrimaryMallTableProps {
  malls: IAffiliateMall[];
  onChangeField: (id: string, patch: Partial<Pick<IAffiliateMall, 'feeRate' | 'accrualRate'>>) => void;
  onOpenSimulator: (mall: IAffiliateMall) => void;
  onEditLogo: (mall: IAffiliateMall) => void;
  // 저장하지 않은 변경 건수 — 이 테이블(대표 제휴몰)만의 값이다. 카탈로그 쪽 변경은 포함하지
  // 않으므로, 경고 배너도 이 카드 안에서만 뜬다.
  dirtyCount: number;
  headerActions?: React.ReactNode;
}

// merchant_source=MANUAL(링크프라이스를 거치지 않는 직계약 제휴몰, 현재는 쿠팡 하나)만 다루는
// 테이블 — 승인 상태·적용 토글·선택 열이 필요 없어 카탈로그 테이블과 별도 컴포넌트로 둔다.
export const TicketAccrualPrimaryMallTable: React.FC<TicketAccrualPrimaryMallTableProps> = ({
  malls,
  onChangeField,
  onOpenSimulator,
  onEditLogo,
  dirtyCount,
  headerActions,
}) => {
  const columns: Column<IAffiliateMall>[] = [
    {
      key: 'logo',
      label: '로고',
      align: 'center',
      width: '70px',
      render: (m) => <LogoCell mall={m} onEdit={onEditLogo} />,
    },
    {
      key: 'name',
      label: '제휴몰',
      align: 'center',
      render: (m) => <span style={{ fontWeight: 700, color: 'var(--text)' }}>{m.name}</span>,
    },
    {
      key: 'feeRate',
      label: '수수료',
      render: (m) => (
        <FeeRateCell mall={m} onChange={(id, feeRate) => onChangeField(id, { feeRate })} />
      ),
    },
    {
      key: 'accrualRate',
      label: '적립률',
      render: (m) => (
        <AccrualRateCell mall={m} onChange={(id, accrualRate) => onChangeField(id, { accrualRate })} />
      ),
    },
    { key: 'margin', label: '마진', render: (m) => <MarginCell mall={m} /> },
    {
      key: 'simulator',
      label: '시뮬레이터',
      render: (m) => <SimulatorButtonCell mall={m} onOpen={onOpenSimulator} />,
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">대표 제휴몰</div>
        {headerActions}
      </div>
      {dirtyCount > 0 && (
        <div
          style={{
            background: 'var(--warning-soft)',
            border: '1px solid var(--warning)',
            borderRadius: 'var(--r-md)',
            margin: '14px 20px',
            padding: '10px 16px',
            fontSize: '13px',
            color: 'var(--warning)',
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          저장하지 않은 변경 {dirtyCount}개 몰 — 저장 버튼을 눌러야 적용됩니다.
        </div>
      )}
      <Table
        data={malls}
        columns={columns}
        keyExtractor={(m) => m.id}
        emptyMessage="등록된 대표 제휴몰이 없습니다."
      />
    </div>
  );
};
