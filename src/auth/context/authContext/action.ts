'use client';

import { setAccessToken, setAdminInfo } from './utils';
import { ApiAuthResponse } from 'src/types/api_response';
import { authAPI } from 'src/api';
import { IAdmin } from 'src/types/admin';

// ----------------------------------------------------------------------

export type SignInParams = {
  username: string;
  password: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signIn = async ({ username, password }: SignInParams): Promise<void> => {
  try {
    // TODO: Implement real authentication API call here
    const params = { username, password };

    const responseData: ApiAuthResponse<IAdmin> = await authAPI.login(params.username, params.password);

    if (!responseData.result || !responseData.result.token) {
      throw new Error('Access token not found in response');
    }
    await setAccessToken(responseData.result.token);
    await setAdminInfo(responseData.result.object);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Error during sign out:', error);
  }
};
