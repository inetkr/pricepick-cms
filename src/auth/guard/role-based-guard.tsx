'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useAuthContext } from '../hooks';
import { useEffect, useState } from 'react';
import { usePathname } from 'src/routes/hooks/use-pathname';

// ----------------------------------------------------------------------

export type RoleBasedGuardProp = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

const acceptPagesByRole = (): Record<string, string[]> => {
  return {
    SUPERADMIN: ['', 'dashboard', 'settings', 'members'],
    OPERATOR: ['dashboard', 'profile'],
    CS: ['dashboard', 'profile'],
  };
};

export function RoleBasedGuard({ sx, children }: RoleBasedGuardProp) {
  const [isAcceptPage, setIsAcceptPage] = useState<boolean>(false);
  const { admin, authenticated, loading } = useAuthContext();
  const pathname = usePathname();

  useEffect(() => {
    if (admin && authenticated && !loading) {
      const acceptPages = acceptPagesByRole();
      const hasAccess =
        typeof acceptPages[admin.role] !== 'undefined' &&
        acceptPages[admin.role].includes(pathname.split('/')[1] || '');
      setIsAcceptPage(hasAccess);
    } else {
      setIsAcceptPage(false);
    }
  }, [admin, pathname, loading, authenticated]);

  if (loading) {
    return null;
  }

  if (!loading && !authenticated) {
    return null;
  }

  if (!isAcceptPage) {
    return (
      <Container sx={{ textAlign: 'center', margin: 'auto', ...sx }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Permission denied
        </Typography>
      </Container>
    );
  }
  return <>{children}</>;
}
