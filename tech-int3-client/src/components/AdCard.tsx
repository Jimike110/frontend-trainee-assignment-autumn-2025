import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Checkbox,
} from '@mui/material';
import type { Ad } from '../types/ads';
import { statusColors, priorityColors } from '../utils/Colors';

interface AdCardProps {
  ad: Ad;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

export const AdCard = ({ ad, isSelected, onToggleSelect }: AdCardProps) => {
  const formattedDate = new Date(ad.createdAt).toLocaleDateString();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); // prevent the click event from propagating to the RouterLink
    onToggleSelect(ad.id);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-10px)',
          transition: 'transform 0.3s ease',
        },
      }}
    >
      <Box sx={{ position: 'absolute', top: 4, left: 4, zIndex: 1 }}>
        <Checkbox
          checked={isSelected}
          onChange={handleCheckboxChange}
          color="info"
          sx={{
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
          }}
        />
      </Box>
      <CardMedia
        component="img"
        height="160"
        image={ad.images[0] || 'https://placehold.co/360x160'}
        alt={ad.title}
      />

      <RouterLink to={`/item/${ad.id}`}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {ad.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ad.category} • {formattedDate}
          </Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>
            {ad.price.toLocaleString('ru-RU')} ₽
          </Typography>
        </CardContent>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={ad.status}
              color={statusColors[ad.status]}
              size="small"
              variant="outlined"
            />
            <Chip
              label={ad.priority}
              color={priorityColors[ad.priority]}
              size="small"
            />
          </Box>
          <Button size="small">
            Открыть
          </Button>
        </Box>
      </RouterLink>
    </Card>
  );
};
