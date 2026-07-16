import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  EMPLOYEE_ROLE_LABELS,
  EMPLOYEE_ROLE_PERMISSIONS,
  EMPLOYEE_ROLE_TAG_CLASS,
} from 'src/constants/employee';

export const AccountPermissionCard: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">권한별 가능 작업</div>
    </div>
    <div>
      <div className="policy-item">
        <div className="policy-label" style={{ color: 'var(--main)' }}>
          슈퍼어드민
        </div>
        <div className="policy-value">전체 권한 + 계정 관리 + API 키 관리</div>
      </div>
      <div className="policy-item">
        <div className="policy-label" style={{ color: 'var(--success)' }}>
          운영자
        </div>
        <div className="policy-value">설정/정책/콘텐츠 변경 가능 · 계정 관리 ❌</div>
      </div>
      <div className="policy-item">
        <div className="policy-label" style={{ color: 'var(--info)' }}>
          CS
        </div>
        <div className="policy-value">조회 전용 · 1:1 문의 답변 · 수정 ❌</div>
      </div>
    </div>
  </div>
);
