'use client';

import md5 from 'md5';

import axios, { endpoints } from 'src/utils/axios';

import { setAccessToken } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  username: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signIn = async ({ username, password }: SignInParams): Promise<void> => {
  try {
    // TODO: Implement real authentication API call here
    // const params = { username, password };

    // const res: any = await axios.axiosInstanceWithLoading.post(endpoints.auth.signIn, params);

    // const { token } = res.data;

    // if (!token) {
    //   throw new Error('Access token not found in response');
    // }
    // setAccessToken(token);

    // TODO: Fake token for testing, remove this after implementing real authentication
    const fakeToken = md5(`${username}:${password}`);

    setAccessToken(fakeToken);
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
    await setAccessToken(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
