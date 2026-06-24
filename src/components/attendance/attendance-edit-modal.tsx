'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';

interface EditAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  initialData?: {
    probability: number;
    firstPrize: number;
    secondPrize: number;
    thirdPrize: number;
    startDate: string;
    endDate: string;
    description: string;
  };
}

interface FormData {
  probability: number;
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
  startDate: string;
  endDate: string;
  description: string;
}

export const AttendanceEditModal: React.FC<EditAttendanceModalProps> = ({
  open,
  onClose,
  onSave,
  initialData = {
    probability: 50,
    firstPrize: 1,
    secondPrize: 3,
    thirdPrize: 5,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    description: '주간 이벤트 추첨',
  },
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === 'description' ? value : parseFloat(value) || 0,
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '15px' }}>추첨 설정 수정</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="이벤트 설명"
              value={formData.description}
              onChange={handleChange('description')}
              fullWidth
              size="small"
            />
            <TextField
              label="당첨 확률 (%)"
              type="number"
              value={formData.probability}
              onChange={handleChange('probability')}
              fullWidth
              size="small"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              helperText="응모자 중 당첨자 비율"
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <TextField
                label="1등 당첨자 수"
                type="number"
                value={formData.firstPrize}
                onChange={handleChange('firstPrize')}
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
              />
              <TextField
                label="2등 당첨자 수"
                type="number"
                value={formData.secondPrize}
                onChange={handleChange('secondPrize')}
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
              />
              <TextField
                label="3등 당첨자 수"
                type="number"
                value={formData.thirdPrize}
                onChange={handleChange('thirdPrize')}
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="시작일"
                type="date"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="종료일"
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              * 변경된 설정은 다음 추첨부터 적용됩니다.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: 'var(--main)', '&:hover': { bgcolor: 'var(--main-dark)' } }}
          >
            저장
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
