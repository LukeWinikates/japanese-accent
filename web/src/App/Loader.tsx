import {AxiosResponse} from "axios";
import {LoadableWithError} from "./loadable";
import React, {ComponentType, useCallback, useEffect, useState} from "react";

interface LoaderProps<T> {
  callback: () => Promise<AxiosResponse<T, any>>
  into: ComponentType<Settable<T>>
}

export declare type Settable<T> = {
  value: T,
  setValue: (value: T) => void
}

export function Loader<T>({callback, into}: LoaderProps<T>) {
  const [loadable, setLoadable] = useState<LoadableWithError<T>>({state: "new"});
  useEffect(() => {
    if (loadable.state === "new") {
      setLoadable({state: "loading"})
      callback().then(r => {
        setLoadable({
          state: "loaded",
          data: r.data
        });
      }).catch((err: any) => {
        setLoadable({
          state: "error",
          message: err
        });
      });
    }
  }, [loadable, setLoadable, callback]);


  const setLoadedValue = useCallback((value: T) => {
    return setLoadable({
      state: "loaded",
      data: value
    })
  }, [setLoadable])


  switch (loadable.state) {
    case "loaded": {
      const Into = into
      const value = loadable.data;
      return (
        <Into value={value} setValue={setLoadedValue}/>
      );
    }
    case "new":
    case "loading":
      return (
        <div>loading...</div>
      );
    case "error":
      return (
        <div>failed to load</div>
      );
    default:
      throw new Error("impossible state");
  }
}
