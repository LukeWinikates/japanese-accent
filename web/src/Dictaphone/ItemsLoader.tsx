import {WordAnalysis} from "../App/api";
import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";
import React, {useEffect, useState} from "react";
import {Loadable} from "../App/loadable";
import axios from "axios";

export const ItemsLoader = ({word, children}: { word: string, children: (items: WordAnalysis) => any }) => {
  const {logError} = useServerInteractionHistory();

  const [item, setItem] = useState<Loadable<WordAnalysis>>("loading");
  useEffect(() => {
    axios.get<WordAnalysis>('/api/word-analysis/' + word).then(r => {
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
