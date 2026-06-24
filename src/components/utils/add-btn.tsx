import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type IAddBtnProps = {
  label: string;
  handleClick: () => void;
};

export const AddButton = ({ label, handleClick }: IAddBtnProps) => (
  <Button
    variant="contained"
    onClick={handleClick}
    startIcon={<AddIcon sx={{ fontSize: 20 }} />}
    sx={{
      padding: '0px 12px',
      gap: '8px',
      height: '36px',
      background: '#1C252E',
      borderRadius: '8px',
      fontFamily: 'Public Sans',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '24px',
      color: '#FFFFFF',
    }}
  >
    {label}
  </Button>
);
