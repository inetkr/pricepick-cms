'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export type RoleBasedGuardProp = {
  sx?: SxProps<Theme>;
  currentPage: string;
  children: React.ReactNode;
};

export function RoleBasedGuard({ sx, children, currentPage }: RoleBasedGuardProp) {
  const { user } = useAuthContext();
  const acceptPages = user?.authPages;

  if (!acceptPages) return <>{children}</>;

  if (typeof acceptPages !== 'undefined' && !acceptPages.includes(currentPage)) {
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
