import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const isClient = typeof window === 'object';

  const getMatches = (query: string): boolean => {
    if (isClient) {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    mediaQueryList.addEventListener('change', listener);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
    
  }, [query, isClient]); 

  return matches;
};

export default useMediaQuery;