import type { IAdminRole } from 'src/types/admin_role';

export const EMPLOYEE_ROLE_LABELS: Record<IAdminRole, string> = {
  ADMIN: '관리자',
  SUPERADMIN: '슈퍼어드민',
};

export const EMPLOYEE_ROLE_BADGE_CLASS: Record<IAdminRole, string> = {
  ADMIN: 'badge-green',
  SUPERADMIN: 'badge-red',
};

// role-tag 전용 클래스 (컬러 배지 + 아이콘 조합, .role-tag.superadmin/.operator/.cs)
export const EMPLOYEE_ROLE_TAG_CLASS: Record<IAdminRole, string> = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

// 계정 생성/수정 시 CMS에서 선택 가능한 역할 (슈퍼어드민 제외)
export const EMPLOYEE_ROLE_OPTIONS: { value: IAdminRole; label: string }[] = [
  { value: 'ADMIN', label: '관리자' },
  { value: 'SUPERADMIN', label: '슈퍼어드민' },
];

export interface IEmployeeRoleCapability {
  label: string;
  allowed: boolean;
}

