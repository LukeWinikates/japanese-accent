import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";
import React, {useEffect, useState} from "react";
import {Loadable} from "./loadable";
import {useFetch} from "use-http";

export function Loader<T> ({apiEndpoint, children}: { apiEndpoint: string, children: (items: T) => any }) {
  const {logError} = useServerInteractionHistory();

  const [item, setItem] = useState<Loadable<T>>("loading");
  const {get} = useFetch(apiEndpoint);
  useEffect(() => {
    get().then(analysis => {
      console.log(analysis);
      setItem({data: analysis});
    }).catch(logError);
  }, [apiEndpoint])

  if (item === "loading") {
    return <>Loading...</>
  }

  return (
    <>
      {children(item.data)}
    </>
  );
}