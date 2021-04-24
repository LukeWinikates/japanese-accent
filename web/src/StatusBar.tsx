import React, {createContext, useContext, useState} from "react"
import {LinearProgress} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";

export declare type Status = {
  error: string | null,
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
  const {state} = useStatus();
  const [snackBarState, setSnackBarState] = useState<boolean>(!!state.error);
  const handleClose = () => setSnackBarState(false);
  console.log(state);
  console.log(!!state.error);
  console.log("snackbar: ", snackBarState);
  return (
    <>
      {state.spinner ? <LinearProgress/> : <></>}
      <Snackbar open={snackBarState} autoHideDuration={6000} onClose={handleClose}>
        {state.error ?
          <Alert onClose={handleClose} severity="error">
            Error: {state.error}
          </Alert>
          : <></>}
      </Snackbar>
    </>
  );
};