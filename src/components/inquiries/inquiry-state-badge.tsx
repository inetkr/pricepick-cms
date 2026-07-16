import React from 'react';
import { QNA_STATE_BADGE_CLASS, QNA_STATE_LABELS } from 'src/constants/qna';
import type { IQnaState } from 'src/types/qna';

interface InquiryStateBadgeProps {
  state: IQnaState | string;
}

export const InquiryStateBadge: React.FC<InquiryStateBadgeProps> = ({ state }) => {
  const key = state as IQnaState;
  return (
    <span className={`badge ${QNA_STATE_BADGE_CLASS[key] || 'badge-gray'}`}>
      {QNA_STATE_LABELS[key] || state}
    </span>
  );
};
