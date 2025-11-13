import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Alert,
  Pagination as MuiPagination,
} from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAds } from '../api/adsApi';
import { AdCard } from '../components/AdCard';
import React, { useMemo, useState } from 'react';
import type { GetAdsParams, Status } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { AdFilters } from '../components/AdFilters';

const AdListPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const debouncedFilters = useDebounce(
    {
      search: searchTerm,
      minPrice: minPrice,
      maxPrice: maxPrice,
    },
    500
  );

  const queryParams: GetAdsParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedFilters.search || undefined,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      categoryId: Number(categoryFilter) || undefined,
      minPrice: Number(debouncedFilters.minPrice) || undefined,
      maxPrice: Number(debouncedFilters.maxPrice) || undefined,
    }),
    [page, debouncedFilters, statusFilter, categoryFilter]
  );

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['ads', queryParams],
    queryFn: () => getAds(queryParams),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter([]);
    setCategoryFilter('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const ads = data?.ads || [];
  const paginationInfo = data?.pagination;

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

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          Advertisements
        </Typography>

        <AdFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onReset={handleResetFilters}
        />
      </Box>

      {ads.length === 0 ? (
        <Typography>No advertisements found matching your criteria.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {ads.map((ad) => (
              <Grid key={ad.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <AdCard ad={ad} />
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <MuiPagination
              count={paginationInfo?.totalPages || 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
              hideNextButton={
                isPlaceholderData ||
                paginationInfo?.currentPage === paginationInfo?.totalPages
              }
            />
            {paginationInfo && (
              <Typography variant="body1" color="text.secondary">
                Showing {ads.length} of {paginationInfo.totalItems}
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdListPage;
