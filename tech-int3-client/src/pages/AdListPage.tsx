import React, { useMemo, useState, useRef } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Alert,
  Pagination as MuiPagination,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getAds, approveMultipleAds, rejectMultipleAds } from '../api/adsApi';
import { AdCard } from '../components/AdCard';
import type { GetAdsParams, Status } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { useHotkeys } from '../hooks/useHotkeys';
import { AdFilters } from '../components/AdFilters';
import { AdSort } from '../components/AdSort';
import { BulkActionsBar } from '../components/BulkActionsBar';
import { RejectAdModal } from '../components/RejectAdModal';
import toast from 'react-hot-toast';

const AdListPage = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [sortOption, setSortOption] = useState('createdAt_desc'); // Default value like in server

  const queryClient = useQueryClient();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedAds, setSelectedAds] = useState<number[]>([]);

  // Bulk approve mutation
  const bulkApproveMutation = useMutation({
    mutationFn: () => approveMultipleAds(selectedAds),
    onSuccess: () => {
      toast.success(`${selectedAds.length} ad(s) approved successfully.`);
      setSelectedAds([]);
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: () => toast.error('An error occurred during bulk approval.'),
  });

  // Bulk reject mutation
  const bulkRejectMutation = useMutation({
    mutationFn: (payload: { reason: string; comment?: string }) =>
      rejectMultipleAds(selectedAds, payload),
    onSuccess: () => {
      toast.success(`${selectedAds.length} ad(s) rejected successfully.`);
      setSelectedAds([]);
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: () => toast.error('An error occurred during bulk rejection.'),
  });

  const handleBulkRejectionSubmit = (reason: string, comment?: string) => {
    bulkRejectMutation.mutate({ reason, comment });
    setIsRejectModalOpen(false);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedAds((prev) =>
      prev.includes(id) ? prev.filter((adId) => adId !== id) : [...prev, id]
    );
  };

  const debouncedFilters = useDebounce(
    {
      search: searchTerm,
      minPrice: minPrice,
      maxPrice: maxPrice,
    },
    500
  );

  useHotkeys([
    [
      '/',
      () => {
        searchInputRef.current?.focus();
      },
    ],
    ['.', () => searchInputRef.current?.focus()],
  ]);

  const queryParams: GetAdsParams = useMemo(() => {
    const [sortBy, sortOrder] = sortOption.split('_') as [
      GetAdsParams['sortBy'],
      GetAdsParams['sortOrder'],
    ];

    return {
      page,
      limit: 10,
      search: debouncedFilters.search || undefined,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      categoryId: Number(categoryFilter) || undefined,
      minPrice: Number(debouncedFilters.minPrice) || undefined,
      maxPrice: Number(debouncedFilters.maxPrice) || undefined,
      sortBy,
      sortOrder,
    };
  }, [page, debouncedFilters, statusFilter, categoryFilter, sortOption]);

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
    setSortOption('createdAt_desc');
  };

  const ads = data?.ads || [];
  const paginationInfo = data?.pagination;
  const areAllOnPageSelected =
    ads.length > 0 && ads.every((ad) => selectedAds.includes(ad.id));

  const handleSelectAll = () => {
    if (areAllOnPageSelected) {
      setSelectedAds((prev) =>
        prev.filter((id) => !ads.some((ad) => ad.id === id))
      );
    } else {
      const pageIds = ads.map((ad) => ad.id);
      setSelectedAds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

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
        <AdSort value={sortOption} onChange={setSortOption} />
      </Box>

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
        ref={searchInputRef}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={areAllOnPageSelected}
            indeterminate={selectedAds.length > 0 && !areAllOnPageSelected}
            onChange={handleSelectAll}
          />
        }
        label="Select all on page"
        sx={{ mb: 2 }}
      />

      {ads.length === 0 ? (
        <Typography>No advertisements found matching your criteria.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {ads.map((ad) => (
              <Grid key={ad.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <AdCard
                  isSelected={selectedAds.includes(ad.id)}
                  onToggleSelect={handleToggleSelect}
                  ad={ad}
                />
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

          {selectedAds.length > 0 && (
            <BulkActionsBar
              selectedCount={selectedAds.length}
              onApprove={() => bulkApproveMutation.mutate()}
              onReject={() => setIsRejectModalOpen(true)}
              onClear={() => setSelectedAds([])}
            />
          )}

          <RejectAdModal
            open={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            onSubmit={handleBulkRejectionSubmit}
          />
        </>
      )}
    </Box>
  );
};

export default AdListPage;
