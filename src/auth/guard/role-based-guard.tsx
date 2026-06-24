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

  console.log('RoleBasedGuard', { admin, authenticated, loading, pathname });

  useEffect(() => {
    console.log('RoleBasedGuard useEffect', { admin, authenticated, loading, pathname });
    if (admin && authenticated && !loading) {
      const acceptPages = acceptPagesByRole();
      if (
        typeof acceptPages[admin.role] !== 'undefined' &&
        acceptPages[admin.role].includes(pathname.split('/')[1] || '')
      ) {
        setIsAcceptPage(true);
      }
    }
  }, [admin, pathname, loading, authenticated]);

  console.log('RoleBasedGuard', { admin, authenticated, loading, isAcceptPage });

  if (!admin || !authenticated || loading) {
    return <></>;
  }

  console.log('RoleBasedGuard', { admin, authenticated, loading, isAcceptPage });

  if (!isAcceptPage) {
    return (
      <Container sx={{ textAlign: 'center', margin: 'auto', ...sx }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Permission denied
        </Typography>
      </Container>
    );
  }
  return <> {children} </>;
}
