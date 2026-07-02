'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes';
import type { ReactNode} from 'react';
import { useEffect, useState } from 'react';
import { MuiGlobalStyles } from './mui-global-styles';

const getMuiTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: { mode, primary: { main: '#845EEE' }, secondary: { main: '#D97706' } },
    typography: { fontFamily: 'var(--font)' },
    shape: { borderRadius: 10 },
  });

function ThemeSync() {
  const { resolvedTheme } = useNextTheme();
  useEffect(() => {
    if (resolvedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [resolvedTheme]);
  return null;
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </NextThemeProvider>
    );
  }

  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ThemeSync />
      <MuiGlobalStyles />
      <MuiThemeProvider theme={getMuiTheme('light')}>{children}</MuiThemeProvider>
    </NextThemeProvider>
  );
}
