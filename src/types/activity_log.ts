import type { IAdminRole } from './admin_role';
import type { IBase } from './base';

export type IActivityLog = IBase & {
  id: string;
  employee_id: string;
  username: string;
  fullname: string;
  role: IAdminRole;
  action: string;
  module: string;
  target_id: string;
  description: string;
  ip: string;
};
