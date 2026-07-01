'use client';

import { useMemo, useState, useCallback, createContext, useContext } from 'react';
import { ProcessingScreen } from 'src/components/processing-screen';
import { useAxiosWithLoading } from 'src/utils/use-axios-with-loading';

export type LoadingContextValue = {
  onLoading: () => void;
  onStopLoading: () => void;
};

export type LoadingProviderProps = {
  children: React.ReactNode;
};

export const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export const LoadingConsumer = LoadingContext.Consumer;

export function useLoadingContext() {
  const context = useContext(LoadingContext);

  if (!context) throw new Error('useLoadingContext must be use inside LoadingProvider');

  return context;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const onLoading = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onStopLoading = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      onLoading,
      onStopLoading,
    }),
    [onStopLoading, onLoading]
  );

  return (
    <LoadingContext.Provider value={memoizedValue}>
      <>
        {children}
        {openDrawer && <ProcessingScreen />}
      </>
    </LoadingContext.Provider>
  );
}

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <AxiosLoader>{children}</AxiosLoader>
    </LoadingProvider>
  );
}

export default function AxiosLoader({ children }: { children: React.ReactNode }) {
  useAxiosWithLoading();
  return <>{children}</>;
}
