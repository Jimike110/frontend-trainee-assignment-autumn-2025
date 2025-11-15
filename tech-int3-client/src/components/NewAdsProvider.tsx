import { useCallback, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NewAdsContext } from '../context/NewAdsContext';
import { getNewAdsCount } from '../api/adsApi';

interface NewAdsProviderProps {
  children: ReactNode;
}

export const NewAdsProvider = ({ children }: NewAdsProviderProps) => {
  const queryClient = useQueryClient();
  const [latestAdTimestamp, setLatestAdTimestamp] = useState<string | null>(null);

  // When false, polling is paused (used while user is navigating / paginating)
  const [isPollingEnabled, setIsPollingEnabled] = useState<boolean>(true);

  const { data: newAdsCountData } = useQuery({
    queryKey: ['newAdsCount', latestAdTimestamp],
    queryFn: () => getNewAdsCount(latestAdTimestamp ?? ''),
    // Only poll when we have a timestamp and polling is enabled
    enabled: Boolean(latestAdTimestamp) && isPollingEnabled,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    // keep previous so UI doesn't flash on small blips
    staleTime: 3000,
  });

  const newAdsCount = newAdsCountData?.newCount ?? 0;

  const triggerRefetch = useCallback(() => {
    // Invalidate the ads list so UI fetches fresh data immediately
    queryClient.invalidateQueries({ queryKey: ['ads'] });

    // Reset the count in the query cache and pause polling briefly to avoid
    // immediate re-trigger from the provider side.
    queryClient.setQueryData(['newAdsCount', latestAdTimestamp], { newCount: 0 });
    setIsPollingEnabled(false);
    // Re-enable after a short delay to resume background polling (optional)
    // setTimeout(() => setIsPollingEnabled(true), 1000);
  }, [queryClient, latestAdTimestamp]);

  const updateLatestTimestamp = useCallback((timestamp: string | null) => {
    setLatestAdTimestamp(timestamp);
    // when a new "since" timestamp is set explicitly, resume polling so provider can check against it
    setIsPollingEnabled(true);
  }, []);

  const setPollingEnabled = useCallback((enabled: boolean) => {
    setIsPollingEnabled(enabled);
  }, []);

  const contextValue = {
    newAdsCount,
    triggerRefetch,
    setLatestAdTimestamp: updateLatestTimestamp,
    setPollingEnabled,
  };

  return <NewAdsContext.Provider value={contextValue}>{children}</NewAdsContext.Provider>;
};
