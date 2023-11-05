import { useCallback } from 'react';

export const useInfiniteScroll = (
  setLoading: (loading: boolean) => void,
  setPageStart: (pageStart: number) => void,
  observer: any,
  data: any,
  isEnd: boolean,
) => {
  const { size, loading } = data;
  const fetchData = useCallback(() => {
    setLoading(true);
    setPageStart(size + 1);
  }, [setLoading, setPageStart, size]);

  const lastDataRendered = useCallback(
    (node: any) => {
      if (loading || isEnd) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log('intersecting >>>>');
          fetchData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, isEnd, fetchData, observer],
  );

  return { lastDataRendered };
};
