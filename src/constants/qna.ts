import type { IQnaState, IQnaType } from 'src/types/qna';

export const QNA_STATE_LABELS: Record<IQnaState, string> = {
  PENDING: '미처리',
  COMPLETED: '처리 완료',
};

export const QNA_STATE_BADGE_CLASS: Record<IQnaState, string> = {
  PENDING: 'badge-red',
  COMPLETED: 'badge-green',
};

export const QNA_STATE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '전체 상태' },
  { value: 'PENDING', label: QNA_STATE_LABELS.PENDING },
  { value: 'COMPLETED', label: QNA_STATE_LABELS.COMPLETED },
];

export const QNA_TYPE_LABELS: Record<IQnaType, string> = {
  TICKET_EARN: '티켓 적립',
  GIFT_EXCHANGE: '기프티콘 교환',
  TICKET_CONVERT: '티켓 교환·환수',
  ACCOUNT: '계정·로그인',
  OTHER: '기타',
};

export const QNA_TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '전체 유형' },
  { value: 'TICKET_EARN', label: QNA_TYPE_LABELS.TICKET_EARN },
  { value: 'GIFT_EXCHANGE', label: QNA_TYPE_LABELS.GIFT_EXCHANGE },
  { value: 'TICKET_CONVERT', label: QNA_TYPE_LABELS.TICKET_CONVERT },
  { value: 'ACCOUNT', label: QNA_TYPE_LABELS.ACCOUNT },
  { value: 'OTHER', label: QNA_TYPE_LABELS.OTHER },
];
