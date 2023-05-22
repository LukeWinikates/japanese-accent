import React, {createContext, useContext, useReducer} from 'react';

export interface HistoryEvent {
  text: string,
  severity: "info" | "debug" | "warning" | "error";
}

let initial: ServerInteractionHistory = {
  events: [],
  pendingHttpRequests: 0,
};

type HistoryContext = {
  state: ServerInteractionHistory,
  logError: (e: string) => any
};

let noOp = () => {
};

const ServerInteractionHistoryContext = createContext<HistoryContext>({
    state: initial,
    logError: noOp
  }
);

export function useServerInteractionHistory() {
  const context = useContext(ServerInteractionHistoryContext);
  if (!context) {
    throw new Error(`useStatus must be used within a StatusProvider`)
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

  const logError = (e: string) => {
    dispatch({
      level: "error",
      message: e
    })
  }
  return (
    <ServerInteractionHistoryContext.Provider value={{state, logError}}>
      {children}
    </ServerInteractionHistoryContext.Provider>
  )
};

