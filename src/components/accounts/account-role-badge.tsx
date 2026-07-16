import React from 'react';
import { EMPLOYEE_ROLE_BADGE_CLASS, EMPLOYEE_ROLE_LABELS } from 'src/constants/employee';
import type { IAdminRole } from 'src/types/admin_role';

interface AccountRoleBadgeProps {
  role: IAdminRole;
}

export const AccountRoleBadge: React.FC<AccountRoleBadgeProps> = ({ role }) => (
  <span className={`badge ${EMPLOYEE_ROLE_BADGE_CLASS[role]}`}>{EMPLOYEE_ROLE_LABELS[role]}</span>
);
