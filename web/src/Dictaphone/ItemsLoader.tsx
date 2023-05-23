import {WordAnalysis} from "../api/types";
import {useServerInteractionHistory} from "../App/useServerInteractionHistory";
import React, {useEffect, useState} from "react";
import {Loadable} from "../App/loadable";
import {wordAnalysisGET} from "../api/ApiRoutes";

export const ItemsLoader = ({word, children}: { word: string, children: (items: WordAnalysis) => any }) => {
  const {logError} = useServerInteractionHistory();

  const [item, setItem] = useState<Loadable<WordAnalysis>>("loading");
  useEffect(() => {
    wordAnalysisGET(word).then(r => {
      setItem({data: r.data});
    }).catch(logError);
  }, [word, logError])

  if (item === "loading") {
    return <>Loading...</>
  }

  return (
    <>
      {children(item.data)}
    </>
  );
}
