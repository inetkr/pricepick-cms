import { Stack, Typography } from '@mui/material';

type ITitleIconProps = {
  icon: React.ReactNode;
  title: string;
};

export const TitleIcon = ({ icon, title }: ITitleIconProps) => (
  <Stack direction="row" spacing={1} alignItems="left" justifyContent="left">
    {icon}
    <Typography
      sx={{
        fontWeight: 500,
        fontFamily: 'Public Sans',
        fontSize: 14,
        lineHeight: '22px',
        color: '#637381',
      }}
    >
      {title}
    </Typography>
  </Stack>
);
