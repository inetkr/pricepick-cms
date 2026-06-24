'use client';

import { Box, Paper, Button, TextField, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

export const LoginWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `radial-gradient(ellipse at 60% 30%, ${alpha(theme.palette.primary.main, 0.1)}, transparent 60%), #EDE8F8`,
}));

export const LoginCard = styled(Paper)(({ theme }) => ({
  width: 400,
  maxWidth: 'calc(100vw - 32px)',
  padding: theme.spacing(5),
  borderRadius: 20,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[10],
}));

export const LogoMark = styled(Box)(({ theme }) => ({
  width: 42,
  height: 42,
  borderRadius: 12,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, #9B78FF)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
}));

export const RoleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flex: 1,
  border: `1.5px solid ${theme.palette.divider}`,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  padding: '9px 6px',
  fontSize: '11px',
  fontWeight: 600,
  color: active ? theme.palette.primary.dark : theme.palette.text.secondary,
  textTransform: 'none',
  fontFamily: theme.typography.fontFamily,
  textAlign: 'center',
  transition: 'all 0.15s',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.primary.main, 0.04),
  },
  '& span': {
    display: 'block',
    fontSize: '9px',
    fontWeight: 500,
    marginTop: '2px',
    opacity: 0.6,
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    fontSize: 13,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
    borderWidth: 1.5,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));

export const LoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  padding: '13px',
  fontSize: '14px',
  fontWeight: 700,
  borderRadius: theme.shape.borderRadius,
  marginTop: '4px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
