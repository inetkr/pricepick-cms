import type { IAdminRole } from "./admin_role";
import type { IBase } from "./base";

export type IAdmin  = IBase & {
    id: string;
    username: string;
    email: string;
    fullname: string;
    role: IAdminRole;
    status: boolean;
    action: any;
    refresh_token: string;
    last_ip: string;
    last_online: number;
}

// role은 SUPERADMIN을 제외하고 CMS에서 생성/수정 가능
export type IManageableAdminRole = Exclude<IAdminRole, 'SUPERADMIN'>;

export type ICreateEmployeePayload = {
    username: string;
    email: string;
    password: string;
    fullname: string;
    role: IManageableAdminRole;
}

export type IUpdateEmployeePayload = {
    fullname: string;
    role: IManageableAdminRole;
}