import axios from 'src/utils/axios';

import { ADMIN_INFO_KEY, STORAGE_KEY } from './constant';

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
    console.error('Error during set access token:', error);
    throw error;
  }
}

export async function setAdminInfo(adminData: any | null) {
  try {
    if (adminData) {
      localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(adminData));
    } else {
      localStorage.removeItem(ADMIN_INFO_KEY);
    }
  } catch (error) {
    console.error('Error during set admin info:', error);
    throw error;
  }
}
