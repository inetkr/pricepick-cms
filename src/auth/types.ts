import { IAdmin } from "src/types/admin";

export type AuthState = {
  admin: IAdmin | null;
  loading: boolean;
};

export type AuthContextValue = {
  admin: IAdmin | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession: () => Promise<void>;
  logout: () => Promise<void>;
};
