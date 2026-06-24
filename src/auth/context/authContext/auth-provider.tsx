// 'use client';

// import { useMemo, useEffect, useCallback } from 'react';
// import { useSetState } from 'src/hooks/use-set-state';
// import axios, { endpoints } from 'src/utils/axios';
// import { setAccessToken } from './utils';
// import { STORAGE_KEY, USER_INFO_KEY } from './constant';
// import { AuthContext } from '../auth-context';
// import type { AuthState } from '../../types';
// // import { IEmployee } from 'src/types/employee/get';
// // import { authPages, IAuthPage } from 'src/assets/data';
// // import { EMPLOYEE_ROLE } from 'src/assets/data/employee-role';
// // ----------------------------------------------------------------------

// /**
//  * NOTE:
//  * We only build demo at basic level.
//  * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
//  */

// type Props = {
//   children: React.ReactNode;
// };

// export function AuthProvider({ children }: Props) {
//   const { state, setState } = useSetState<AuthState>({
//     user: null,
//     loading: true,
//   });

//   // const getAcceptPage = (user: IEmployee) => {
//   //   const filterAcceptPages = (pages: IAuthPage[], acceptPages: string[]): string[] => {
//   //     const expandedPages = pages.flatMap((page) => {
//   //       if (page.children && page.children.length > 0) {
//   //         return [page.code, ...page.children.map((child) => child.code)];
//   //       }
//   //       return [page.code];
//   //     });

//   //     return expandedPages.filter((page) => acceptPages.includes(page));
//   //   };
//   //   // Auth page list
//   //   if (user?.role === EMPLOYEE_ROLE.SUPER_ADMIN)
//   //     return authPages.flatMap((page) =>
//   //       page.children && page.children.length > 0
//   //         ? [page.code, ...page.children.map((child) => child.code)]
//   //         : [page.code]
//   //     );
//   //   return filterAcceptPages(authPages, user.authPages || []);
//   // };

//   const checkUserSession = useCallback(async () => {
//     try {
//       const accessToken = localStorage.getItem(STORAGE_KEY);
//       if (!accessToken) {
//         setState({ user: null, loading: false });
//         return;
//       }

//       // TODO: Fake token validation. You should replace this with real API call to validate the token and fetch user data.
//       setState({
//         ...state,
//         user: null,
//         loading: false,
//       });
//       return;

//       setAccessToken(accessToken);

//       try {
//         const { data } = await axios.axiosInstanceWithLoading.get(`${endpoints.auth.me}`);
//         const user = data.data as IEmployee;

//         const updatedUser = {
//           ...user,
//           authPages: getAcceptPage(user),
//           imageUrl: '/images/avatar/level1.svg',
//         };

//         setState({ user: updatedUser, loading: false });
//         localStorage.setItem(USER_INFO_KEY, JSON.stringify(updatedUser));
//       } catch (error: any) {
//         console.error('Error fetching user data:', error);
//         localStorage.removeItem(USER_INFO_KEY);
//         setAccessToken(null);
//         setState({ user: null, loading: false });
//       }
//     } catch (error) {
//       console.error('Error during user session check:', error);
//       localStorage.removeItem(USER_INFO_KEY);
//       setAccessToken(null);
//       setState({ user: null, loading: false });
//     }
//   }, [setState]);

//   useEffect(() => {
//     checkUserSession();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ----------------------------------------------------------------------

//   const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

//   const status = state.loading ? 'loading' : checkAuthenticated;

//   const memoizedValue = useMemo(
//     () => ({
//       user: state.user ?? null,
//       checkUserSession,
//       loading: status === 'loading',
//       authenticated: status === 'authenticated',
//       unauthenticated: status === 'unauthenticated',
//     }),
//     [checkUserSession, state.user, status]
//   );

//   return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
// }
