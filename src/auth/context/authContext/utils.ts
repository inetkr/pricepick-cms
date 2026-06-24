import axios from 'src/utils/axios';

import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export async function setAccessToken(accessToken: string | null) {
  try {
    if (accessToken) {
      localStorage.setItem(STORAGE_KEY, accessToken);

      axios.axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      axios.axiosInstanceWithLoading.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem(STORAGE_KEY);
      delete axios.axiosInstance.defaults.headers.common.Authorization;
      delete axios.axiosInstanceWithLoading.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}
