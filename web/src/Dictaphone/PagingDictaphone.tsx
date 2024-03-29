import {Audio} from "../api/types";
import React, {useCallback, useEffect, useState} from "react";
import {WithIndex} from "../App/WithIndex";
import {Typography} from "@mui/material";
import {Dictaphone} from "./Dictaphone";
import {Pager} from "./Pager";

export function PagingDictaphone({items}: { items: Audio[] }) {
  const [currentItem, setCurrentItem] = useState<WithIndex<Audio> | null>({
      value: items[0],
      index: 0
    }
  );

  useEffect(() => {
    setCurrentItem({
      value: items[0],
      index: 0
    })
  }, [items])

  const setByIndex = useCallback((i: number) => {
    setCurrentItem({
      index: i, value: items[i]
    })
  }, [setCurrentItem, items]);

  if (currentItem === null) {
    return <>No items</>;
  }

  return (
    <>
      <Typography>
        #{currentItem.index + 1} / {items.length}
        <span role="img"
              aria-label={currentItem.value.speakerGender === "m" ? "male" : "female"}>
          {currentItem.value.speakerGender === "m" ? "👨" : "👩"}
        </span>
        {currentItem.value.speakerUsername}
      </Typography>
      <Dictaphone item={currentItem.value}/>
      <Pager currentIndex={currentItem.index}
             maxIndex={items.length - 1}
             setByIndex={setByIndex}/>
    </>);
}