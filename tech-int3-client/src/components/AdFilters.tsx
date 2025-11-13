import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  type SelectChangeEvent,
} from '@mui/material';
import type { Status } from '../types';

interface AdFiltersProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  statusFilter: Status[];
  onStatusChange: (statuses: Status[]) => void;
}

const statuses: Status[] = ['pending', 'approved', 'rejected'];

export const AdFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: AdFiltersProps) => {
  const handleStatusChange = (
    event: SelectChangeEvent<typeof statusFilter>
  ) => {
    const {
      target: { value },
    } = event;
    onStatusChange(
      typeof value === 'string' ? (value.split(',') as Status[]) : value
    );
  };

  return (
    <Box
      component="form"
      sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label="Search by title"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          id="status-filter"
          multiple
          value={statusFilter}
          onChange={handleStatusChange}
          input={<OutlinedInput label="Status" />}
        >
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
