'use client';

import { useEffect } from "react";
import axios from "./axios";
import { useLoadingContext } from "src/context/loading-context";

export const useAxiosWithLoading = () => {
  const { onLoading, onStopLoading } = useLoadingContext();

  useEffect(() => {
    // request interceptor
    const reqInterceptor = axios.axiosInstanceWithLoading.interceptors.request.use((config) => {
      onLoading();
      return config;
    });

    // response interceptor
    const resInterceptor = axios.axiosInstanceWithLoading.interceptors.response.use(
      (response) => {
        onStopLoading();
        return response;
      },
      (error) => {
        onStopLoading();
        return Promise.reject(error);
      }
    );

    // cleanup interceptors on unmount
    return () => {
      axios.axiosInstanceWithLoading.interceptors.request.eject(reqInterceptor);
      axios.axiosInstanceWithLoading.interceptors.response.eject(resInterceptor);
    };
  }, [onLoading, onStopLoading]);
};
