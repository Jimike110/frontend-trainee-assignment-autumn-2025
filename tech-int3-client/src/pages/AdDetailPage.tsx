import React, { useMemo, useRef, useState } from 'react';
import {
  useParams,
  Link as RouterLink,
  useNavigate,
  useLocation,
} from 'react-router-dom';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Carousel from '../components/Carousel';
import {
  approveAd,
  getAdById,
  rejectAd,
  returnAdForChanges,
} from '../api/adsApi';
import toast from 'react-hot-toast';
import { priorityColors, statusColors } from '../utils/Colors';
import { RejectAdModal } from '../components/RejectAdModal';
import { useHotkeys, type HotkeyConfig } from '../hooks/useHotkeys';
import Keycap from '../components/Keycap';
import { AnimatedPage } from '../components/AnimatedPage';
import { ReturnAdModal } from '../components/ReturnAdModal';

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
  const queryClient = useQueryClient();
  const adId = Number(id);
  const navigate = useNavigate();
  const { totalItems } = useLocation().state || {};

  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    data: ad,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ad', adId],
    queryFn: () => getAdById(adId),
    enabled: !isNaN(adId),
    refetchInterval: 5000,
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

  const returnMutation = useMutation({
    mutationFn: (variables: { reason: string; comment?: string }) =>
      returnAdForChanges(adId, variables),
    onSuccess: () => {
      toast.success('Ad returned for changes successfully!');
      queryClient.invalidateQueries({ queryKey: ['ad', adId] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Failed to return ad for changes.'
      );
    },
  });

  const handleRejectSubmit = (reason: string, comment?: string) => {
    rejectMutation.mutate({ reason, comment });
  };

  const handleReturnSubmit = (reason: string, comment?: string) => {
    returnMutation.mutate({ reason, comment });
  };

  const approveButtonRef = useRef<HTMLButtonElement>(null);
  const rejectButtonRef = useRef<HTMLButtonElement>(null);

  const backButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const nextId = direction === 'prev' ? adId - 1 : adId + 1;
    if (nextId > 0) {
      if (direction === 'next' && totalItems && nextId > totalItems) {
        toast.error('This is the last advert.');
        return;
      }
      window.location.href = `/item/${nextId}`;
    }
  };

  const hotkeys = useMemo<HotkeyConfig[]>(
    () => [
      ['a', () => approveButtonRef.current?.click()],
      ['A', () => approveButtonRef.current?.click()],
      ['ф', () => approveButtonRef.current?.click()],
      ['Ф', () => approveButtonRef.current?.click()],
      ['d', () => rejectButtonRef.current?.click()],
      ['D', () => rejectButtonRef.current?.click()],
      ['в', () => rejectButtonRef.current?.click()],
      ['В', () => rejectButtonRef.current?.click()],
      ['ArrowRight', () => nextButtonRef.current?.click()],
      ['ArrowLeft', () => backButtonRef.current?.click()],
    ],
    []
  );

  useHotkeys(hotkeys);

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

  return (
    <AnimatedPage>
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
                    {ad.moderationHistory
                      .sort((a, b) => b.id - a.id)
                      .map((entry) => (
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
                            <strong>{entry.action}</strong> by{' '}
                            {entry.moderatorName} on{' '}
                            {new Date(entry.timestamp).toLocaleString()}
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
                <Grid
                  component={'div'}
                  sx={{ width: '100%', flex: '1 1 300px' }}
                >
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
            ref={approveButtonRef}
            variant="contained"
            color="success"
            sx={{ flex: { xs: '1 0 100%', sm: 1 } }}
            onClick={() => {
              approveMutation.mutate();

              const next = setTimeout(() => {
                navigate(`/item/${ad.id + 1}`);
              }, 1000);

              return () => clearTimeout(next);
            }}
            disabled={approveMutation.isPending || ad?.status === 'approved'}
          >
            {approveMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              <>
              {!isSm && <Keycap variant="filled">A</Keycap>}
                Одобрить
              </>
            )}
          </Button>
          <Button
            ref={rejectButtonRef}
            variant="contained"
            color="error"
            sx={{ flex: { xs: '1 0 100%', sm: 1 } }}
            onClick={() => setRejectModalOpen(true)}
            disabled={rejectMutation.isPending || ad?.status === 'rejected'}
          >
            {rejectMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              <>
                {!isSm && <Keycap variant="filled">D</Keycap>}
                Отклонить
              </>
            )}
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{ flex: { xs: '1 0 100%', sm: 1 } }}
            onClick={() => setReturnModalOpen(true)}
            disabled={returnMutation.isPending || ad?.status === 'draft'}
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
              flexWrap: 'wrap',
              flex: { xs: '1 0 100%', sm: 'auto' },
              justifyContent: { xs: 'space-between', sm: 'flex-end' },
            }}
          >
            <Button
              ref={backButtonRef}
              variant="outlined"
              onClick={() => handleNavigate('prev')}
            >
              {!isSm && (
                <Keycap variant="filled">
                  <ArrowBack />
                </Keycap>
              )}
              Предыдущее
            </Button>
            <Button
              ref={nextButtonRef}
              variant="outlined"
              onClick={() => handleNavigate('next')}
            >
              Следующее
              {!isSm && (
                <Keycap variant="filled">
                  <ArrowForward />
                </Keycap>
              )}
            </Button>
          </Box>
        </Box>
        <RejectAdModal
          open={isRejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onSubmit={handleRejectSubmit}
        />
        <ReturnAdModal
          open={isReturnModalOpen}
          onClose={() => setReturnModalOpen(false)}
          onSubmit={handleReturnSubmit}
        />
      </Box>
    </AnimatedPage>
  );
};

export default AdDetailPage;
