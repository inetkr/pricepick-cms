import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });
const axiosInstanceWithLoading = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);
 
/**
 * An axios instance that does not trigger loading indicators.
 * 
 * This instance is a shallow copy of the default `axiosInstance`, 
 * intended for use in scenarios where you want to perform HTTP requests 
 * without affecting global or contextual loading states in the application.
 * 
 * @see axiosInstance
 */
axiosInstanceWithLoading.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default {axiosInstance, axiosInstanceWithLoading};

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

