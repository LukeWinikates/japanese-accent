import React, {createContext, useContext, useMemo, useReducer} from 'react';

export interface HistoryEvent {
  text: string,
  severity: "info" | "debug" | "warning" | "error";
}

export const initial: ServerInteractionHistory = {
  events: [],
  pendingHttpRequests: 0,
};

type HistoryContext = [
  ServerInteractionHistory,
  {
    logError: (e: string) => any,
    incrementPendingRequestCount: () => void,
    decrementPendingRequestCount: () => void
  }];

let noOp = () => {
};

export const defaultValue: HistoryContext = [
  initial,
  {
    logError: noOp,
    incrementPendingRequestCount: noOp,
    decrementPendingRequestCount: noOp,
  }];

export const ServerInteractionHistoryContext = createContext<HistoryContext>(defaultValue);


export function useServerInteractionHistory() {
  const context = useContext(ServerInteractionHistoryContext);
  if (!context) {
    throw new Error(`useServerInteractionHistory must be used within an EventHistoryProvider`)
  }

  return context
}

export declare type ServerInteractionHistory = {
  events: HistoryEvent[],
  pendingHttpRequests: number,
}

export declare type ServerInteraction = "increment" | "decrement" | {
  level: "info" | "debug" | "warning" | "error",
  message: string
}

function reducer(state: ServerInteractionHistory, action: ServerInteraction): ServerInteractionHistory {
  switch (action) {
    case "increment" : {
      return {
        ...state,
        pendingHttpRequests: state.pendingHttpRequests + 1
      }
    }
    case "decrement": {
      return {
        ...state,
        pendingHttpRequests: state.pendingHttpRequests - 1
      }
    }
  }

  let newItem: HistoryEvent = {
    text: action.message,
    severity: action.level,
  };
  let keptHistory = [newItem, ...state.events.slice(9)];
  return {
    ...state,
    events: keptHistory
  }
}

export const EventHistoryProvider = ({children}: any) => {
  let [state, dispatch] = useReducer(reducer, initial);

  let callbacks = useMemo(() => {
    const logError = (e: string) => {
      dispatch({
        level: "error",
        message: e
      })
    };

    const incrementPendingRequestCount = () => {
      dispatch("increment")
    };

    const decrementPendingRequestCount = () => {
        dispatch("decrement")
      }
    ;
    return {
      logError,
      incrementPendingRequestCount,
      decrementPendingRequestCount
    }
  }, [dispatch])

  return (
    <ServerInteractionHistoryContext.Provider
      value={[state, callbacks]}>
      {children}
    </ServerInteractionHistoryContext.Provider>
  )
};

