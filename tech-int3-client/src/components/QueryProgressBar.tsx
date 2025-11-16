import { useEffect } from 'react';
import NProgress from 'nprogress';
import { useIsFetching } from '@tanstack/react-query';

export const QueryProgressBar = () => {
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
