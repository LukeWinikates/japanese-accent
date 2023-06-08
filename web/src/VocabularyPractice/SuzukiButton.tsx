import React, {useRef} from "react";
import {Button} from "@mui/material";

declare type SuzukiButtonProps = {
  items: string[],
  text: string,
};

const BASE_URL="http://www.gavo.t.u-tokyo.ac.jp/ojad/phrasing/index";

export function SuzukiButton(props: SuzukiButtonProps) {
  const {
    items,
    text
  } = props;
  const formEl = useRef<HTMLFormElement>(null!);

  return (<form action={BASE_URL} method="post" target="_blank" ref={formEl}>
      <input type="hidden"
             value={items.join("\n") || ""}
             name="data[Phrasing][text]"
      />

      {
        Object.entries({
          "curve": "advanced",
          "accent": "advanced",
          "accent_mark": "all",
          "estimation": "crf",
          "analyze": "true",
          "phrase_component": "invisible",
          "param": "invisible",
          "subscript": "visible",
          "jeita": "invisible",
        }).map(([k, v]) => {
          return (<input type="hidden"
                         key={k}
                         value={v}
                         name={`data[Phrasing][${k}]`}
          />)
        })
      }
      <Button onClick={formEl.current?.submit} variant="contained"
              color="secondary">
        {text}
      </Button>
    </form>
  );

}