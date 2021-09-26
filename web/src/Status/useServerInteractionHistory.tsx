import React, {createContext, useContext, useState} from 'react';

export interface HistoryEvent {
  text: string,
}

let noOp = () => {
};

let shim: ServerInteractionHistory = {
  events: [],
  pendingHttpRequests: 0,
  logError: noOp,
  incrementRequests: noOp,
  decrementRequests: noOp
};

const ServerInteractionHistoryContext = createContext<ServerInteractionHistory>(shim);

export function useServerInteractionHistory() {
  const context = useContext(ServerInteractionHistoryContext);
  if (!context) {
    throw new Error(`useStatus must be used within a StatusProvider`)
  }

  return context
}

export declare type ServerInteractionHistory = {
  events: HistoryEvent[],
  logError: (errorMessage: string) => void
  pendingHttpRequests: number,
  incrementRequests: () => void
  decrementRequests: () => void
}

export const EventHistoryProvider = ({children}: any) => {
  let [events, setEvents] = useState<HistoryEvent[]>([]);
  let [pendingHttpRequests, setPendingHttpRequests] = useState(0);

  let eventHistory = {
    events,
    pendingHttpRequests,
    logError: (error: string) => {
      let keptHistory = [{
        text: error
      }, ...events.slice(9)];
      setEvents(keptHistory);
    },
    incrementRequests: () => setPendingHttpRequests(pendingHttpRequests - 1),
    decrementRequests: () => setPendingHttpRequests(pendingHttpRequests + 1),
  }

  return (
    <ServerInteractionHistoryContext.Provider value={eventHistory}>
      {children}
    </ServerInteractionHistoryContext.Provider>
  )
};

