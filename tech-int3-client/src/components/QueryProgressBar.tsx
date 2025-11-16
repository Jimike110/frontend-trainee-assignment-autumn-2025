import { useEffect } from 'react';
import NProgress from 'nprogress';
import { useIsFetching } from '@tanstack/react-query';

export const QueryProgressBar = () => {
  // useIsFetching is a global hook that returns the number of queries currently fetching.
  const isFetching = useIsFetching();

  useEffect(() => {
    if (isFetching) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isFetching]);

  return null;
};
