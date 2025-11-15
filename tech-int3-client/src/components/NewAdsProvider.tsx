import { useCallback, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NewAdsContext } from '../context/NewAdsContext';
import { getNewAdsCount } from '../api/adsApi';

interface NewAdsProviderProps {
  children: ReactNode;
}

export const NewAdsProvider = ({ children }: NewAdsProviderProps) => {
  const queryClient = useQueryClient();
  const [latestAdTimestamp, setLatestAdTimestamp] = useState<string | null>(
    null
  );

  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  const { data: newAdsCountData } = useQuery({
    queryKey: ['newAdsCount', latestAdTimestamp],
    queryFn: () => getNewAdsCount(latestAdTimestamp!),
    enabled: !!latestAdTimestamp && isPollingEnabled,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });

  const newAdsCount = newAdsCountData?.newCount || 0;

  const triggerRefetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['ads'] });
    queryClient.setQueryData(['newAdsCount', latestAdTimestamp], { newCount: 0 })
    setIsPollingEnabled(false);
  }, [queryClient, latestAdTimestamp]);

  const updateLatestTimestamp = useCallback((timestamp: string | null) => {
    setLatestAdTimestamp(timestamp);
    setIsPollingEnabled(true);
  }, []);

  const contextValue = {
    newAdsCount,
    triggerRefetch,
    setLatestAdTimestamp: updateLatestTimestamp,
  };

  return (
    <NewAdsContext.Provider value={contextValue}>
      {children}
    </NewAdsContext.Provider>
  );
};
