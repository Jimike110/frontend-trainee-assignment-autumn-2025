import { useMemo, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Alert,
  Pagination as MuiPagination,
  FormControlLabel,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { useNewAds } from '../context/NewAdsContext';
import { AnimatedPage } from '../components/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { opacity: 0, y: 10 },
};

const AdListPage = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const [liveSearchTerm, setLiveSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const statusFilter = searchParams.getAll('status') as Status[];
  const categoryFilter = searchParams.get('category') || '';
  const [liveMinPrice, setLiveMinPrice] = useState(
    searchParams.get('minPrice') || ''
  );
  const [liveMaxPrice, setLiveMaxPrice] = useState(
    searchParams.get('maxPrice') || ''
  );
  const sortOption = searchParams.get('sort') || 'createdAt_desc';

  const queryClient = useQueryClient();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedAds, setSelectedAds] = useState<number[]>([]);

  const [savedFilters, setSavedFilters] = useState(() => {
    const saved = localStorage.getItem('savedFilterSets');
    return saved ? JSON.parse(saved) : {};
  });

  const { setLatestAdTimestamp, setPollingEnabled } = useNewAds();

  const currentSelectedFilterSet = useMemo(() => {
    const currentParamsString = searchParams.toString();
    const foundEntry = Object.entries(savedFilters).find(
      ([, params]) => params === currentParamsString
    );
    return foundEntry ? foundEntry[0] : '';
  }, [searchParams, savedFilters]);

  const debouncedSearchTerm = useDebounce(liveSearchTerm, 500);
  const debouncedMinPrice = useDebounce(liveMinPrice, 500);
  const debouncedMaxPrice = useDebounce(liveMaxPrice, 500);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const setOrDelete = (key: string, value: string) => {
          if (value) prev.set(key, value);
          else prev.delete(key);
        };
        setOrDelete('search', debouncedSearchTerm);
        setOrDelete('minPrice', debouncedMinPrice);
        setOrDelete('maxPrice', debouncedMaxPrice);
        prev.delete('page');
        return prev;
      },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, debouncedMinPrice, debouncedMaxPrice]);

  useHotkeys([
    ['/', () => searchInputRef.current?.focus()],
    ['.', () => searchInputRef.current?.focus()],
  ]);

  const updateSearchParams = (key: string, value: string | string[] | null) => {
    setSearchParams(
      (prev) => {
        if (
          value === null ||
          (typeof value === 'string' && !value) ||
          (Array.isArray(value) && value.length === 0)
        ) {
          prev.delete(key);
        } else if (Array.isArray(value)) {
          prev.delete(key);
          value.forEach((item) => prev.append(key, item));
        } else {
          prev.set(key, value);
        }
        if (key !== 'page') prev.delete('page');
        return prev;
      },
      { replace: true }
    );
  };

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
    setLiveSearchTerm('');
    setLiveMinPrice('');
    setLiveMaxPrice('');
  };

  const queryParams: GetAdsParams = useMemo(() => {
    const [sortBy, sortOrder] = sortOption.split('_') as [
      GetAdsParams['sortBy'],
      GetAdsParams['sortOrder'],
    ];

    const searchFromURL = searchParams.get('search') || '';
    const minPriceFromURL = searchParams.get('minPrice') || '';
    const maxPriceFromURL = searchParams.get('maxPrice') || '';

    const trimmedSearch = searchFromURL.trim();
    // ограничение от 3 символов
    const effectiveSearchTerm =
      trimmedSearch.length >= 3 ? trimmedSearch : undefined;

    return {
      page,
      limit: 10,
      search: effectiveSearchTerm,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      minPrice: Number(minPriceFromURL) || undefined,
      maxPrice: Number(maxPriceFromURL) || undefined,
      sortBy,
      sortOrder,
    };
  }, [searchParams, statusFilter, categoryFilter, page, sortOption]);

  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: ['ads', queryParams],
    queryFn: () => getAds(queryParams),
    placeholderData: keepPreviousData,
  });

  const ads = useMemo(() => data?.ads || [], [data]);
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

  const adsMap = useMemo(() => new Map(ads.map((ad) => [ad.id, ad])), [ads]);

  // Get the list of selected ad IDs that are NOT already approved.
  const idsToApprove = selectedAds.filter((id) => {
    const ad = adsMap.get(id);
    return ad && ad.status !== 'approved';
  });

  // Get the list of selected ad IDs that are NOT already rejected.
  const idsToReject = selectedAds.filter((id) => {
    const ad = adsMap.get(id);
    return ad && ad.status !== 'rejected';
  });

  const bulkApproveMutation = useMutation({
    mutationFn: () => approveMultipleAds(idsToApprove),
    onSuccess: () => {
      if (idsToApprove.length > 0) {
        toast.success(`${idsToApprove.length} ad(s) approved successfully.`);
      } else {
        toast.error('No ads were eligible for approval.');
      }
      setSelectedAds([]);
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: () => toast.error('An error occurred during bulk approval.'),
  });

  const bulkRejectMutation = useMutation({
    mutationFn: (payload: { reason: string; comment?: string }) =>
      rejectMultipleAds(idsToReject, payload),
    onSuccess: () => {
      if (idsToReject.length > 0) {
        toast.success(`${idsToReject.length} ad(s) rejected successfully.`);
      } else {
        toast.error('No ads were eligible for rejection.');
      }
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

  // Only update NewAds provider on page 1
  useEffect(() => {
    if (!data?.ads?.length) return;

    const newestTimestamp = data.ads.reduce(
      (latest, ad) => (ad.createdAt > latest ? ad.createdAt : latest),
      data.ads[0].createdAt
    );

    if (page === 1) {
      setLatestAdTimestamp(newestTimestamp);
      setPollingEnabled(true);
    } else {
      setPollingEnabled(false);
    }
  }, [data, page, setLatestAdTimestamp, setPollingEnabled]);

  if (isError) {
    return (
      <Alert severity="error">
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }

  return (
    <AnimatedPage>
      <Box>
        {/* Top Filters and Actions */}
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
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Load Saved Filters</InputLabel>
            <Select
              label="Load Saved Filters"
              value={currentSelectedFilterSet}
              onChange={(e) => {
                const name = e.target.value as string;
                if (name) {
                  const paramsString = savedFilters[name];
                  setSearchParams(new URLSearchParams(paramsString), {
                    replace: true,
                  });
                  const newParams = new URLSearchParams(paramsString);
                  setLiveSearchTerm(newParams.get('search') || '');
                  setLiveMinPrice(newParams.get('minPrice') || '');
                  setLiveMaxPrice(newParams.get('maxPrice') || '');
                }
              }}
            >
              {Object.entries(savedFilters).map(([name]) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => {
              const name = prompt('Enter a name for this filter set:');
              if (name) {
                const newSavedFilters = {
                  ...savedFilters,
                  [name]: searchParams.toString(),
                };
                setSavedFilters(newSavedFilters);
                localStorage.setItem(
                  'savedFilterSets',
                  JSON.stringify(newSavedFilters)
                );
              }
            }}
          >
            Save Current Filters
          </Button>
          <Button
            onClick={() => {
              setSavedFilters({});
              localStorage.removeItem('savedFilterSets');
            }}
          >
            Clear Saved Filters
          </Button>
          <AdSort
            value={sortOption}
            onChange={(val) => updateSearchParams('sort', val)}
          />
        </Box>

        {/* Filters */}
        <AdFilters
          searchTerm={liveSearchTerm}
          onSearchChange={setLiveSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={(val) => updateSearchParams('status', val)}
          categoryFilter={categoryFilter}
          onCategoryChange={(val) => updateSearchParams('category', val)}
          minPrice={liveMinPrice}
          onMinPriceChange={setLiveMinPrice}
          maxPrice={liveMaxPrice}
          onMaxPriceChange={setLiveMaxPrice}
          onReset={handleResetFilters}
          ref={searchInputRef}
        />

        {/* Select All */}
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

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : ads.length === 0 ? (
          <Typography>
            No advertisements found matching your criteria.
          </Typography>
        ) : (
          <>
            {/* Ads Grid */}
            <Box
              sx={{
                opacity: isFetching ? 0.7 : 1,
                transition: 'opacity 300ms',
              }}
            >
              <Grid
                container
                spacing={3}
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                // key={page}
              >
                <AnimatePresence>
                  {ads.map((ad) => (
                    <Grid
                      key={ad.id}
                      size={{ xs: 12, sm: 6, md: 4 }}
                      component={motion.div}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <AdCard
                        isSelected={selectedAds.includes(ad.id)}
                        onToggleSelect={handleToggleSelect}
                        ad={ad}
                      />
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </Box>

            {/* Pagination */}
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
                onChange={(_e, value) =>
                  updateSearchParams('page', value.toString())
                }
                color="primary"
                disabled={isFetching}
              />
              {paginationInfo && (
                <Typography
                  sx={{ mb: 17 }}
                  variant="body1"
                  color="text.secondary"
                >
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
    </AnimatedPage>
  );
};

export default AdListPage;
