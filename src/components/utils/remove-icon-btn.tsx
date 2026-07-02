import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type IRemoveIconProps = {
  top?: number;
  left?: number;
  handleClick: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const RemoveIconButton = ({ top, left, handleClick }: IRemoveIconProps) => (
  <IconButton
    className="delete-icon"
    sx={(theme) => ({
      position: 'absolute',
      top: top || 15,
      right: left || 15,
      display: { xs: 'flex', sm: 'none' },
      bgcolor: 'rgba(133, 24, 24, 0.7)',
      color: 'white',
      '&:hover': {
        bgcolor: 'rgba(133, 24, 24, 0.7)',
      },
      width: 24,
      height: 24,
    })}
    onClick={handleClick}
  >
    <CloseIcon sx={{ fontSize: 16 }} />
  </IconButton>
);
