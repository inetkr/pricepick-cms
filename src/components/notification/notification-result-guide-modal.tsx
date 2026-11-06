import React from 'react';
import { Modal } from '../common/modal';

// 발송 기록의 성공·실패·미처리·확인 불가 4칸이 각각 무엇을 세는지 — 성공 칸 제목의 ? 가 연다.
// 4칸의 합은 대상 수와 같다(서버 serializeCampaign 기준).

interface NotificationResultGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const ROWS: { badge: string; label: string; basis: string; cases: string }[] = [
  { badge: 'badge-green', label: '성공', basis: '푸시 서버가 접수함', cases: '정상 발송' },
  {
    badge: 'badge-red',
    label: '실패',
    basis: '보내려 했으나 거절당함',
    cases: '기기 토큰 만료 · 앱 삭제 · 잘못된 토큰 · 네트워크 오류',
  },
  {
    badge: 'badge-amber',
    label: '미처리',
    basis: '보낼 주소가 없어 시도하지 못함',
    cases: '푸시 토큰 없음 · 알림 권한 거부 · 수신 거부',
  },
  {
    badge: 'badge-gray',
    label: '확인 불가',
    basis: '결과를 알 수 없음',
    cases: '응답 없음 · 과거 기록에 결과가 남지 않은 건',
  },
];

export const NotificationResultGuideModal: React.FC<NotificationResultGuideModalProps> = ({
  open,
  onClose,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="발송 결과 기준"
    width="560px"
    footer={
      <button type="button" className="btn btn-ghost" onClick={onClose}>
        닫기
      </button>
    }
  >
    <div className="modal-body">
      <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
        시도했는데 안 된 것은 실패, 시도할 주소조차 없던 것은 미처리입니다.
      </div>
      <table className="ni-guide-table">
        <thead>
          <tr>
            <th style={{ width: '16%' }}>구분</th>
            <th style={{ width: '32%' }}>기준</th>
            <th>해당하는 경우</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <td>
                <span className={`badge ${row.badge}`}>{row.label}</span>
              </td>
              <td>{row.basis}</td>
              <td>{row.cases}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.8 }}>
        <div>네 칸의 합은 대상 수와 일치합니다.</div>
        <div>마케팅 수신 미동의 회원은 대상 수에 포함되지 않습니다.</div>
      </div>
    </div>
  </Modal>
);
