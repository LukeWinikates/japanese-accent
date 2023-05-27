import {WordAnalysis} from "../api/types";
import React, {useEffect, useState} from "react";
import {Loadable} from "../App/loadable";
import {useBackendAPI} from "../App/useBackendAPI";

export const ItemsLoader = ({word, children}: { word: string, children: (items: WordAnalysis) => any }) => {
  const [item, setItem] = useState<Loadable<WordAnalysis>>("loading");
  const api = useBackendAPI();

  useEffect(() => {
    api.wordAnalysis.GET(word).then(r => {
      setItem({data: r.data});
    })
  }, [word, api.wordAnalysis])

  if (item === "loading") {
    return <>Loading...</>
  }

  return (
    <>
      {children(item.data)}
    </>
  );
}
