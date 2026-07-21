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

export type ICreateEmployeePayload = {
    username: string;
    email: string;
    password: string;
    fullname: string;
    role: IAdminRole;
}

export type IUpdateEmployeePayload = {
    fullname: string;
    role: IAdminRole;
}