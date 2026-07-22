'use client';

import type { Theme, SxProps } from '@mui/material/styles';
// import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export type RoleBasedGuardProp = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

export function RoleBasedGuard({ sx, children }: RoleBasedGuardProp) {
  // const { authenticated, loading } = useAuthContext();
  // if (loading || (!loading && !authenticated)) {
  //   return null;
  // }
  // TODO: Implement role-based access control logic here, e.g., check user roles and permissions
  return <>{children}</>;
}
