import { createContext, useContext } from 'react';

interface NewAdsContextType {
  newAdsCount: number;
  triggerRefetch: () => void;
  setLatestAdTimestamp: (timestamp: string | null) => void;
  setPollingEnabled: (enabled: boolean) => void;
}

export const NewAdsContext = createContext<NewAdsContextType>({
  newAdsCount: 0,
  triggerRefetch: () => {},
  setLatestAdTimestamp: () => {},
  setPollingEnabled: () => {},
});

export const useNewAds = () => useContext(NewAdsContext);
