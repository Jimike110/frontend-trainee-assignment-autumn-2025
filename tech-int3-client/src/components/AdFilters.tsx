import { forwardRef } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  type SelectChangeEvent,
  Grid,
  Button,
} from '@mui/material';
import type { Status } from '../types';
import { CATEGORIES } from '../config/constants';
import Keycap from './Keycap';

interface AdFiltersProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  statusFilter: Status[];
  onStatusChange: (statuses: Status[]) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  minPrice: string;
  onMinPriceChange: (minPrice: string) => void;
  maxPrice: string;
  onMaxPriceChange: (maxPrice: string) => void;
  onReset: () => void;
}

const statuses: Status[] = ['pending', 'approved', 'rejected', 'draft'];

export const AdFilters = forwardRef<HTMLDivElement, AdFiltersProps>(
  (
    {
      searchTerm,
      onSearchChange,
      statusFilter,
      onStatusChange,
      categoryFilter,
      onCategoryChange,
      minPrice,
      onMinPriceChange,
      maxPrice,
      onMaxPriceChange,
      onReset,
    }: AdFiltersProps,
    ref
  ) => {
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
      <Box component="div" sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid container size={{ xs: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by title"
              InputProps={{
                endAdornment: <Keycap variant="outlined">/</Keycap>,
              }}
              value={searchTerm || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              inputRef={ref}
            />
          </Grid>
          <Grid container size={{ xs: 12, md: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value)}
                input={<OutlinedInput label="Category" />}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid container size={{ xs: 12, md: 6, lg: 5 }}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                multiple
                value={statusFilter}
                onChange={handleStatusChange}
                input={<OutlinedInput label="Status" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid container size={{ xs: 6, md: 3, lg: 2 }}>
            <TextField
              fullWidth
              label="Min price"
              variant="outlined"
              type="number"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
            />
          </Grid>
          <Grid container size={{ xs: 6, md: 3, lg: 2 }}>
            <TextField
              fullWidth
              label="Max price"
              variant="outlined"
              type="number"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
            />
          </Grid>
          <Grid container size={{ xs: 12, md: 6, lg: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onReset}
              sx={{ height: '56px' }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
);
