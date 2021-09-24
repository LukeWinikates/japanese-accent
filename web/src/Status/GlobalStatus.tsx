import {useState} from 'react';

export interface HistoryEvent {
  text: string,
}

export function useEventHistory() {
  const [eventHistory, setEventHistory] = useState<HistoryEvent[]>([]);

  function logEvent(event: HistoryEvent) {
    console.error(event.text);
    let keptHistory = [event, ...eventHistory.slice(9)];
    setEventHistory(keptHistory);
  }

  return {eventHistory, logEvent};
}