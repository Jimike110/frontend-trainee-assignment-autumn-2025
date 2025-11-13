import React, { useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Carousel from '../components/Carousel';
import { approveAd, getAdById, rejectAd } from '../api/adsApi';
import toast from 'react-hot-toast';
import { priorityColors, statusColors } from '../utils/Colors';
import { RejectAdModal } from '../components/RejectAdModal';

// helper component for displaying label-value pairs
const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <Typography variant="body1" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ textAlign: 'right' }}>
      {value}
    </Typography>
  </Box>
);

const AdDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const adId = Number(id);

  const [isRejectModalOpen, setRejectModalOpen] = useState(false);

  const {
    data: ad,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ad', adId],
    queryFn: () => getAdById(adId),
    enabled: !isNaN(adId),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveAd(adId),
    onSuccess: () => {
      toast.success('Ad approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['ad', adId] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to approve ad.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (variables: { reason: string; comment?: string }) =>
      rejectAd(adId, variables),
    onSuccess: () => {
      toast.success('Ad rejected successfully!');
      queryClient.invalidateQueries({ queryKey: ['ad', adId] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to reject ad.');
    },
  });

  const handleRejectSubmit = (reason: string, comment?: string) => {
    rejectMutation.mutate({ reason, comment });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !ad) {
    return (
      <Alert severity="error">
        Error loading ad:{' '}
        {error instanceof Error ? error.message : 'Ad not found'}
      </Alert>
    );
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    const nextId = direction === 'prev' ? adId - 1 : adId + 1;
    if (nextId > 0) {
      navigate(`/item/${nextId}`);
    }
  };

  return (
    <Box>
      <Grid container direction={'column'} spacing={3}>
        <Typography variant="h4" gutterBottom>
          {ad.title}
        </Typography>
        <Grid container spacing={3}>
          <Grid container size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              {ad.images.length > 1 ? (
                <Carousel sx={{ width: '100%' }}>
                  {ad.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${ad.title} - Image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                      }}
                    />
                  ))}
                </Carousel>
              ) : (
                <img
                  src={ad.images[0]}
                  alt={ad.title}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                  }}
                />
              )}
            </Paper>
          </Grid>

          {/* Moderation History */}
          <Grid container size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, height: '100%', width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Moderation History
              </Typography>
              <Divider sx={{ my: 2 }} />
              {ad.moderationHistory.length > 0 ? (
                <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                  {ad.moderationHistory.map((entry) => (
                    <Box
                      key={entry.id}
                      sx={{
                        mb: 1,
                        p: 1,
                        border: '1px solid #eee',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        <strong>{entry.action}</strong> by {entry.moderatorName}{' '}
                        on {new Date(entry.timestamp).toLocaleString()}
                      </Typography>
                      {entry.reason && (
                        <Typography variant="caption">
                          Reason: {entry.reason}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No moderation history yet.
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
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
            </Paper>
          </Grid>
        </Grid>

        {/* Ad Details Section */}
        <Grid container sx={{ mt: 4 }} spacing={3}>
          {/* Price and Description */}
          <Grid container>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {ad.price.toLocaleString('ru-RU')} ₽
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {ad.description}
              </Typography>
            </Paper>
          </Grid>

          {/* Seller Information and Characteristics */}
          <Grid container size={{ xs: 12, md: 12 }}>
            <Grid
              component={'div'}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 5,
                width: '100%',
                flexWrap: 'wrap',
              }}
              spacing={2}
            >
              <Grid component="div" sx={{ width: '100%', flex: '1 1 300px' }}>
                <Paper sx={{ p: 2, minHeight: '230px' }}>
                  <Typography variant="h6" gutterBottom>
                    Seller Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <InfoItem label="Name" value={ad.seller.name} />
                  <InfoItem label="Rating" value={`${ad.seller.rating} ★`} />
                  <InfoItem label="Total Ads" value={ad.seller.totalAds} />
                </Paper>
              </Grid>
              <Grid component={'div'} sx={{ width: '100%', flex: '1 1 300px' }}>
                <Paper sx={{ p: 2, minHeight: '230px' }}>
                  <Typography variant="h6" gutterBottom>
                    Characteristics
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {Object.entries(ad.characteristics).map(([key, value]) => (
                    <InfoItem key={key} label={key} value={value} />
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Paper sx={{ p: 2, mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="success"
          sx={{ flex: { xs: '1 0 100%', sm: 1 } }}
          onClick={() => approveMutation.mutate()}
          disabled={approveMutation.isPending || ad?.status === 'approved'}
        >
          {approveMutation.isPending ? (
            <CircularProgress size={24} />
          ) : (
            'Одобрить'
          )}
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ flex: { xs: '1 0 100%', sm: 1 } }}
          onClick={() => setRejectModalOpen(true)}
          disabled={rejectMutation.isPending || ad?.status === 'rejected'}
        >
          {rejectMutation.isPending ? (
            <CircularProgress size={24} />
          ) : (
            'Отклонить'
          )}
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ flex: { xs: '1 0 100%', sm: 1 } }}
        >
          Вернуть на доработку
        </Button>
      </Paper>

      {/* Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 6,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Button
          component={RouterLink}
          to="/list"
          sx={{ flex: { xs: '1 0 100%', sm: 'auto' } }}
        >
          <ArrowBack /> Назад к списку
        </Button>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flex: { xs: '1 0 100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <Button variant="outlined" onClick={() => handleNavigate('prev')}>
            Предыдущее
          </Button>
          <Button variant="outlined" onClick={() => handleNavigate('next')}>
            Следующее
          </Button>
        </Box>
      </Box>
      <RejectAdModal
        open={isRejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </Box>
  );
};

export default AdDetailPage;
