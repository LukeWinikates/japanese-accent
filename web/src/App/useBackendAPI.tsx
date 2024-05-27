import axios from "axios";
import React, {createContext, useContext, useMemo} from "react";
import {ApiClient, NewApiClient} from "../api/client";
import {useServerInteractionHistory} from "./useServerInteractionHistory";


export const BackendAPIContext = createContext<ApiClient>(null!);

export function useBackendAPI() {
  const context = useContext(BackendAPIContext);
  if (!context) {
    throw new Error(`useBackendAPI must be used within a BackendAPIProvider`)
  }

  return context
}

export const BackendAPIProvider = ({children}: any) => {
  const [, callbacks] = useServerInteractionHistory();
  const value = useMemo(() => {
    const {incrementPendingRequestCount, decrementPendingRequestCount, logError} = callbacks;
    const axiosInstance = axios.create({})
    axiosInstance.interceptors.request.use((config) => {
      incrementPendingRequestCount();
      return config
    })
    axiosInstance.interceptors.response.use((response) => {
      decrementPendingRequestCount();
      return response
    }, function (error) {
      decrementPendingRequestCount();
      logError(error);
      return Promise.reject(error)
    })

    return NewApiClient(axiosInstance)
  }, [callbacks]);


  return (
    <BackendAPIContext.Provider value={value}>
      {children}
    </BackendAPIContext.Provider>
  )
};
