import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import type { Reason } from '../types';

const rejectionReasons: Exclude<Reason, 'Другое' | null>[] = [
  'Запрещенный товар',
  'Неверная категория',
  'Некорректное описание',
  'Проблемы с фото',
  'Подозрение на мошенничество',
];

interface ReturnAdModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, comment?: string) => void;
}

// TODO: Add keyboard choosing of reasons and enter should submit the form
export const ReturnAdModal = ({
  open,
  onClose,
  onSubmit,
}: ReturnAdModalProps) => {
  const [selectedReason, setSelectedReason] =
    useState<Reason>('Запрещенный товар');
  const [otherReasonText, setOtherReasonText] = useState('');

  const handleSubmit = () => {
    const reason =
      selectedReason === 'Другое' ? otherReasonText : selectedReason;
    if (!reason) {
      alert('Please provide a reason for rejection.');
      return;
    }
    onSubmit(reason);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Return Advertisement</DialogTitle>
      <DialogContent>
        <FormControl fullWidth component="fieldset" sx={{ mt: 1 }}>
          <RadioGroup
            aria-label="rejection-reason"
            name="rejection-reason-group"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value as Reason)}
          >
            {rejectionReasons.map((reason) => (
              <FormControlLabel
                key={reason}
                value={reason}
                control={<Radio />}
                label={reason}
              />
            ))}
            <FormControlLabel
              value="Другое"
              control={<Radio />}
              label="Other"
            />
          </RadioGroup>
        </FormControl>
        {selectedReason === 'Другое' && (
          <TextField
            autoFocus
            margin="dense"
            id="other-reason"
            label="Please specify the reason"
            type="text"
            fullWidth
            variant="standard"
            value={otherReasonText}
            onChange={(e) => setOtherReasonText(e.target.value)}
            sx={{ mt: 1 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="warning">
          Submit Return
        </Button>
      </DialogActions>
    </Dialog>
  );
};
