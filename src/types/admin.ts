import { IAdminRole } from "./admin_role";
import { IBase } from "./base";

export type IAdmin  = IBase & {
    id: string;
    username: string;
    email: string;
    role: IAdminRole;
    status: boolean;
    action: any;
    refresh_token: string;
    last_ip: string;
    last_online: number;
}