import {WordAnalysis} from "../api/types";
import React, {useCallback} from "react";
import {useBackendAPI} from "../App/useBackendAPI";
import {PagingDictaphone} from "./PagingDictaphone";
import {Loader} from "../App/Loader";

const Into = function ({value}: { value: WordAnalysis }) {
  return (
    <PagingDictaphone items={value.audio}/>
  )
}

export const WordAnalysisLoader = ({word}: { word: string }) => {
  const api = useBackendAPI();
  const callback = useCallback(() => {
    return api.wordAnalysis.GET(word)
  }, [word, api.wordAnalysis])

  return (
    <Loader
      callback={callback}
      into={Into}
    />
  );
}
