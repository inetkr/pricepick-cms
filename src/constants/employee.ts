import type { IAdminRole } from 'src/types/admin_role';
import type { IManageableAdminRole } from 'src/types/admin';

export const EMPLOYEE_ROLE_LABELS: Record<IAdminRole, string> = {
  SUPERADMIN: '슈퍼어드민',
  OPERATOR: '운영자',
  // CS: 'CS',
};

export const EMPLOYEE_ROLE_BADGE_CLASS: Record<IAdminRole, string> = {
  SUPERADMIN: 'badge-purple',
  OPERATOR: 'badge-green',
  // CS: 'badge-blue',
};

// role-tag 전용 클래스 (컬러 배지 + 아이콘 조합, .role-tag.superadmin/.operator/.cs)
export const EMPLOYEE_ROLE_TAG_CLASS: Record<IAdminRole, string> = {
  SUPERADMIN: 'superadmin',
  OPERATOR: 'operator',
  // CS: 'cs',
};

// 계정 생성/수정 시 CMS에서 선택 가능한 역할 (슈퍼어드민 제외)
export const EMPLOYEE_ROLE_OPTIONS: { value: IManageableAdminRole; label: string }[] = [
  { value: 'OPERATOR', label: '운영자' },
  // { value: 'CS', label: 'CS' },
];

export interface IEmployeeRoleCapability {
  label: string;
  allowed: boolean;
}

export const EMPLOYEE_ROLE_PERMISSIONS: { role: IAdminRole; capabilities: IEmployeeRoleCapability[] }[] = [
  {
    role: 'SUPERADMIN',
    capabilities: [
      { label: '전체 권한', allowed: true },
      { label: '계정 관리', allowed: true },
      { label: 'API 키 관리', allowed: true },
    ],
  },
  {
    role: 'OPERATOR',
    capabilities: [
      { label: '설정/정책/콘텐츠 변경', allowed: true },
      { label: '계정 관리', allowed: false },
    ],
  },
  // {
  //   role: 'CS',
  //   capabilities: [
  //     { label: '조회 전용', allowed: true },
  //     { label: '1:1 문의 답변', allowed: true },
  //     { label: '그 외 수정', allowed: false },
  //   ],
  // },
];
