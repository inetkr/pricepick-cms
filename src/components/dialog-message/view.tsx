import { Button, Stack, Typography, Modal, Box } from '@mui/material';

type IProps = {
  icon?: string | null;
  isConfirm?: boolean;
  message: string;
  onConfirm?: () => void;
  hideMessage: () => void;
};

export const DialogMessageView = ({ icon, isConfirm, message, onConfirm, hideMessage }: IProps) => (
  <Modal
    open
    onClose={hideMessage}
    sx={{
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        bgcolor: 'background.paper',
        padding: 2,
        minWidth: 340,
        minHeight: 200,
        borderRadius: '16px',
        boxShadow: (theme) =>
          `0px 0px 2px ${theme.palette.divider}, 0px 12px 24px -4px ${theme.palette.divider}`,
        outline: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {icon && (
        <img
          src={icon}
          alt="Icon"
          style={{
            width: 40,
            height: 40,
            marginBottom: 16,
          }}
        />
      )}
      <Typography
        sx={{
          fontSize: 12,
          lineHeight: '16px',
          color: 'text.primary',
        }}
      >
        <span dangerouslySetInnerHTML={{ __html: message }} />
      </Typography>
      <Stack direction="row" justifyContent="center" width="100%" spacing={2} mt={2}>
        <Button
          sx={{
            borderRadius: '8px',
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            color: 'primary.contrastText',
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
          disableRipple
          onClick={isConfirm ? onConfirm : hideMessage}
        >
          확인
        </Button>
        {isConfirm && (
          <Button
            variant="outlined"
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: '24px',
              color: 'text.primary',
              borderColor: 'divider',
              borderRadius: '8px',
              '&:hover': {
                borderColor: 'text.secondary',
              },
            }}
            disableRipple
            onClick={hideMessage}
          >
            취소
          </Button>
        )}
      </Stack>
    </Box>
  </Modal>
);
