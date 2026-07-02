import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ICloseIconProps = {
  top?: number;
  right?: number;
  handleClick: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const CloseIconButton = ({ top, right, handleClick }: ICloseIconProps) => (
  <IconButton
    aria-label="close"
    onClick={handleClick}
    sx={(theme) => ({
      position: 'absolute',
      right: right || 8,
      top: top || 8,
      color: theme.palette.grey[500],
    })}
  >
    <CloseIcon />
  </IconButton>
);
