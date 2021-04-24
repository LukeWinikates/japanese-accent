import React, {createContext, useContext} from "react"
import {LinearProgress} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";

export declare type StatusError = {
  message: string,
  seen: boolean,
}

export declare type Status = {
  error: StatusError | null,
  spinner: boolean,
}

export declare type StateAndSetter<T> = {
  state: T,
  setter: (state: T) => void,
}


export const StatusContext = createContext<StateAndSetter<Status>>({
  state: {
    error: null,
    spinner: false,
  },
  setter: () => {
    throw new Error("dummy function: this should never be called");
  }
});

export function useStatus() {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error(`useStatus must be used within a StatusProvider`)
  }

  return context
}

export const StatusProvider = ({children}: any) => {
  const [status, setStatus] = React.useState<Status>({
    error: null,
    spinner: false,
  });

  let value: StateAndSetter<Status> = {
    state: status,
    setter: setStatus,
  };
  return (
    <StatusContext.Provider value={value}>
      {children}
    </StatusContext.Provider>
  )
};

export const StatusBar = () => {
  const {state, setter} = useStatus();
  const handleCloseSnackBarError = () => setter({
    ...state,
    error: state.error ? {
      ...state.error,
      seen: true,
    } : null,
  });

  return (
    <>
      {state.spinner ? <LinearProgress/> : <></>}
      <Snackbar open={!!state.error && !state.error.seen} autoHideDuration={6000} onClose={handleCloseSnackBarError}>
        {state.error ?
          <Alert onClose={handleCloseSnackBarError} severity="error">
            Error: {state.error.message}
          </Alert>
          : <></>}
      </Snackbar>
    </>
  );
};