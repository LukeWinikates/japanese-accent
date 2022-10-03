import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";
import React, {useEffect, useState} from "react";
import {Loadable} from "./loadable";
import axios from "axios";

export function Loader<T> ({apiEndpoint, children}: { apiEndpoint: string, children: (items: T) => any }) {
  const {logError} = useServerInteractionHistory();

  const [item, setItem] = useState<Loadable<T>>("loading");
  useEffect(() => {
    axios.get<T>(apiEndpoint).then(r => {
      console.log(r.data);
      setItem({data: r.data});
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