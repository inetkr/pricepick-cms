'use client';

import { Backdrop, CircularProgress } from '@mui/material';
import type { BoxProps } from '@mui/material/Box';
import Portal from '@mui/material/Portal';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  portal?: boolean;
};

export function ProcessingScreen({ portal = true, sx, ...other }: Props) {
  const content = (
    <Backdrop sx={(theme) => ({ color: theme.palette.common.white, zIndex: 9999 })} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  if (portal) {
    return <Portal>{content}</Portal>;
  }

  return content;
}
