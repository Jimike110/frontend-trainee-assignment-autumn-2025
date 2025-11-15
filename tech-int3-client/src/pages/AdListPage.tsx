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

  const currentSelectedFilterSet = useMemo(() => {
    const currentParamsString = searchParams.toString();
    const foundEntry = Object.entries(savedFilters).find(
      ([, params]) => params === currentParamsString
    );
    return foundEntry ? foundEntry[0] : '';
  }, [searchParams, savedFilters]);

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

  const debouncedSearchTerm = useDebounce(liveSearchTerm, 500);
  const debouncedMinPrice = useDebounce(liveMinPrice, 500);
  const debouncedMaxPrice = useDebounce(liveMaxPrice, 500);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const setOrDelete = (key: string, value: string) => {
          if (value) {
            prev.set(key, value);
          } else {
            prev.delete(key);
          }
        };

        setOrDelete('search', debouncedSearchTerm);
        setOrDelete('minPrice', debouncedMinPrice);
        setOrDelete('maxPrice', debouncedMaxPrice);

        prev.delete('page');
        return prev;
      },
      { replace: true }
    );
  }, [
    debouncedSearchTerm,
    debouncedMinPrice,
    debouncedMaxPrice,
    // setSearchParams,
  ]);

  useHotkeys([
    [
      '/',
      () => {
        searchInputRef.current?.focus();
      },
    ],
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

        if (key !== 'page') {
          prev.delete('page');
        }

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

    const debouncedSearchFromURL = searchParams.get('search') || '';
    const debouncedMinPriceFromURL = searchParams.get('minPrice') || '';
    const debouncedMaxPriceFromURL = searchParams.get('maxPrice') || '';

    return {
      page,
      limit: 10,
      search: debouncedSearchFromURL || undefined,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      minPrice: Number(debouncedMinPriceFromURL) || undefined,
      maxPrice: Number(debouncedMaxPriceFromURL) || undefined,
      sortBy,
      sortOrder,
    };
  }, [searchParams, statusFilter, categoryFilter, page, sortOption]);

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['ads', queryParams],
    queryFn: () => getAds(queryParams),
    placeholderData: keepPreviousData,
  });

  // useEffect(() => {
  //   setSelectedAds([]);
  // }, [queryParams]);

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
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Load Saved Filters</InputLabel>
          <Select
            label="Load Saved Filters"
            value={currentSelectedFilterSet}
            onChange={(e) => {
              const selectedName = e.target.value as string;
              if (selectedName) {
                const paramsString = savedFilters[selectedName];
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
            {Object.entries(savedFilters).map(([name,]) => (
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
              onChange={(_e, value) =>
                updateSearchParams('page', value.toString())
              }
              color="primary"
              hideNextButton={
                isPlaceholderData ||
                paginationInfo?.currentPage === paginationInfo?.totalPages
              }
            />
            {paginationInfo && (
              <Typography sx={{ mb: 17 }} variant="body1" color="text.secondary">
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
