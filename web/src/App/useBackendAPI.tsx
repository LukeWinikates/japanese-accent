import axios from "axios";
import React, {createContext, useCallback, useContext} from "react";
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
  const {logError, incrementPendingRequestCount, decrementPendingRequestCount} = useServerInteractionHistory();

  const value = useCallback(() => {
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
  }, [logError, incrementPendingRequestCount, decrementPendingRequestCount])();


  return (
    <BackendAPIContext.Provider value={value}>
      {children}
    </BackendAPIContext.Provider>
  )
};
