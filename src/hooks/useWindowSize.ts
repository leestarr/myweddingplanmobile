import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const getWindowSize = (): WindowSize => {
  const width = window.innerWidth;
  return {
    width,
    height: window.innerHeight,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
};

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    // Initialize with current window size
    setWindowSize(getWindowSize());

    // Add event listener
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    // Add debounced event listener
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedHandleResize);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  return windowSize;
}

// Helper functions
export const isMobileWidth = (width: number) => width < 768;
export const isTabletWidth = (width: number) => width >= 768 && width < 1024;
export const isDesktopWidth = (width: number) => width >= 1024;

// Breakpoint values for reference
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  large: 1536,
} as const;