'use client';

import { useMemo, useEffect, useCallback } from 'react';
import { useSetState } from 'src/hooks/use-set-state';
import { setAccessToken, setAdminInfo } from './utils';
import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import type { AuthState } from '../../types';
import { employeeAPI } from 'src/api';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    admin: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);
      if (!accessToken) {
        setState({ admin: null, loading: false });
        return;
      }

      await setAccessToken(accessToken);

      try {
        const responseData = await employeeAPI.getMe();

        if (!responseData.result || !responseData.result.object) {
          setState({ admin: null, loading: false });
          return;
        }
        setState({ admin: { ...state.admin, ...responseData.result.object }, loading: false });
        setAdminInfo(responseData.result.object);
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        setAdminInfo(null);
        setAccessToken(null);
        setState({ admin: null, loading: false });
      }
    } catch (error) {
      console.error('Error during user session check:', error);
      setAdminInfo(null);
      setAccessToken(null);
      setState({ admin: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkUserSession]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.admin ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      admin: state.admin ?? null,
      checkUserSession,
      logout: async () => {
        await setAccessToken(null);
        await setAdminInfo(null);
        setState({ admin: null, loading: false });
      },
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.admin, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
