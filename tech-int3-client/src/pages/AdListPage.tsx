import { Box, CircularProgress, Grid, Typography, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAds } from '../api/adsApi';
import { AdCard } from '../components/AdCard';

const AdListPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['ads', {}],
    queryFn: () => getAds({ page: 1, limit: 10 }),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Error:{' '}
        {error instanceof Error ? error.message : 'An unknown error occurred'}
      </Alert>
    );
  }

  const ads = data?.ads || [];
  const pagination = data?.pagination;

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          Advertisements
        </Typography>
        {pagination && (
          <Typography variant="body1" color="text.secondary">
            Showing {ads.length} of {pagination.totalItems}
          </Typography>
        )}
      </Box>

      {ads.length === 0 ? (
        <Typography>No advertisements found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {ads.map((ad) => (
            <Grid key={ad.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <AdCard ad={ad} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdListPage;
