import { forwardRef } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  Button,
  Slider,
  FormControlLabel,
  Checkbox,
  Typography,
  FormGroup,
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

const MAX_PRICE = 150000;

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
    const handleStatusChange = (status: Status, isChecked: boolean) => {
      const newStatusFilter = isChecked
        ? [...statusFilter, status]
        : statusFilter.filter((s) => s !== status);
      onStatusChange(newStatusFilter);
    };

    const handlePriceChange = (newValue: number | number[]) => {
      if (Array.isArray(newValue)) {
        onMinPriceChange(newValue[0].toString());
        onMaxPriceChange(newValue[1].toString());
      }
    };

    const priceValue: [number, number] = [
      Number(minPrice) || 0,
      Number(maxPrice) || MAX_PRICE,
    ];

    return (
      <Box
        component="div"
        sx={{
          mb: 4,
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by title (3+ characters)"
              InputProps={{
                endAdornment: <Keycap variant="outlined">/</Keycap>,
              }}
              value={searchTerm || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              inputRef={ref}
              helperText={
                searchTerm.trim().length > 0 && searchTerm.trim().length < 3
                  ? 'Enter at least 3 characters'
                  : ''
              }
              error={searchTerm.trim().length > 0 && searchTerm.trim().length < 3}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
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

          <Grid size={{ xs: 12 }}>
            <FormControl component="fieldset" variant="standard">
              <Typography component="legend" variant="body2" sx={{ mb: 1 }}>
                Status
              </Typography>
              <FormGroup row>
                {statuses.map((status) => (
                  <FormControlLabel
                    key={status}
                    control={
                      <Checkbox
                        checked={statusFilter.includes(status)}
                        onChange={(e) =>
                          handleStatusChange(status, e.target.checked)
                        }
                        name={status}
                      />
                    }
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Typography gutterBottom>Price Range</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
              <Typography sx={{ minWidth: 80}}>{priceValue[0].toLocaleString()} ₽</Typography>
              <Slider
                value={priceValue}
                onChange={(_, newValue) => handlePriceChange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={MAX_PRICE}
                step={1000}
                disableSwap
              />
              <Typography sx={{ minWidth: 80}}>{priceValue[1].toLocaleString()} ₽</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onReset}
              sx={{ height: '56px', mt: { xs: 2, md: 0 } }}
            >
              Reset All Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
)
