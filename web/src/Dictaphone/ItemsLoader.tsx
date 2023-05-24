import {WordAnalysis} from "../api/types";
import React, {useEffect, useState} from "react";
import {Loadable} from "../App/loadable";
import {wordAnalysisGET} from "../api/ApiRoutes";

export const ItemsLoader = ({word, children}: { word: string, children: (items: WordAnalysis) => any }) => {
  const [item, setItem] = useState<Loadable<WordAnalysis>>("loading");
  useEffect(() => {
    wordAnalysisGET(word).then(r => {
      setItem({data: r.data});
    })
  }, [word])

  if (item === "loading") {
    return <>Loading...</>
  }

  return (
    <>
      {children(item.data)}
    </>
  );
}
