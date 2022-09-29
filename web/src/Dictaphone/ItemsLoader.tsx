import {WordAnalysis} from "../App/api";
import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";
import React, {useEffect, useState} from "react";
import {Loadable} from "../App/loadable";
import {useFetch} from "use-http";

export const ItemsLoader = ({word, children}: { word: string, children: (items: WordAnalysis) => any }) => {
  const {logError} = useServerInteractionHistory();

  const [item, setItem] = useState<Loadable<WordAnalysis>>("loading");
  const {get: getAudio} = useFetch('/api/word-analysis/');
  useEffect(() => {
    getAudio(word).then(analysis => {
      console.log(analysis);
      setItem({data: analysis});
    }).catch(logError);
  }, [word, getAudio, logError])

  if (item === "loading") {
    return <>Loading...</>
  }

  return (
    <>
      {children(item.data)}
    </>
  );
}
