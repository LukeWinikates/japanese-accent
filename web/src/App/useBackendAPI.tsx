import axios from "axios";
import React, {createContext, useMemo, useContext} from "react";
import {ApiClient, NewApiClient} from "../api/client";
import {useServerInteractionHistory} from "./useServerInteractionHistory";


// @ts-ignore
const BackendAPIContext = createContext<ApiClient>(null);

export function useBackendAPI() {
  const context = useContext(BackendAPIContext);
  if (!context) {
    throw new Error(`useBackendAPI must be used within a StatusProvider`)
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

    let value = NewApiClient(axiosInstance);
    console.log("new api client created")
    return value
  }, [callbacks]);


  return (
    <BackendAPIContext.Provider value={value}>
      {children}
    </BackendAPIContext.Provider>
  )
};
