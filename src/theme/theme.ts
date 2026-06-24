import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#845EEE', dark: '#6C4AB6', light: '#9B78FF' },
    secondary: { main: '#6C4AB6' },
    background: { default: '#F4F1FB', paper: '#FFFFFF' },
    text: { primary: '#1A1130', secondary: '#5A5370', disabled: '#9B93B0' },
    divider: '#E4DFF0',
    success: { main: '#16A34A' },
    error: { main: '#DC2626' },
    warning: { main: '#D97706' },
    info: { main: '#2563EB' },
  },
  typography: {
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
  },
  shape: { borderRadius: 10 },
  shadows: ['none', '0px 1px 3px rgba(0,0,0,0.08)', ...Array(23).fill('none')] as any,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#845EEE', dark: '#9B78FF', light: '#B59EFF' },
    secondary: { main: '#9B78FF' },
    background: { default: '#0B0C12', paper: '#111318' },
    text: { primary: '#E5E7EB', secondary: '#9CA3AF', disabled: '#6B7280' },
    divider: '#252836',
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  shadows: lightTheme.shadows,
});

export { lightTheme, darkTheme };