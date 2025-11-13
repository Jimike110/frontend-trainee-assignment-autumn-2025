import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import type { Ad } from '../types/ads';

interface AdCardProps {
  ad: Ad;
}

const statusColors: Record<Ad['status'], 'success' | 'warning' | 'error'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
};

export const AdCard = ({ ad }: AdCardProps) => {
  const formattedDate = new Date(ad.createdAt).toLocaleDateString();

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        height="160"
        image={ad.images[0] || 'https://via.placeholder.com/360x160'}
        alt={ad.title}
      />
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
        <Chip label={ad.status} color={statusColors[ad.status]} size="small" />
        <Button component={RouterLink} to={`/item/${ad.id}`} size="small">
          Открыть
        </Button>
      </Box>
    </Card>
  );
};
