import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';

interface AdSortProps {
  value: string;
  onChange: (value: string) => void;
}

const sortOptions = [
  { value: 'createdAt_desc', label: 'Date: Newest First' },
  { value: 'createdAt_asc', label: 'Date: Oldest First' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'priority_desc', label: 'Priority: Urgent first' },
];

export const AdSort = ({ value, onChange }: AdSortProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 220 }} size="small">
      <InputLabel id="sort-by-label">Sort By</InputLabel>
      <Select
        labelId="sort-by-label"
        id="sort-by-select"
        value={value}
        label="Sort By"
        onChange={handleChange}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
