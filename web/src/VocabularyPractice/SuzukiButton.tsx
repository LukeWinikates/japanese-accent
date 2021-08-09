import React, {useRef} from "react";
import {CategoryDetails} from "../api";
import {Button} from "@material-ui/core";
import LinkIcon from "@material-ui/core/SvgIcon/SvgIcon";

declare type SuzukiButtonProps = {
  category: CategoryDetails | null;
};

export function SuzukiButton(props: SuzukiButtonProps) {
  const {
    category
  } = props;
  const formEl = useRef<HTMLFormElement>(null);

  const submitForm = () => {
    formEl.current?.submit();
  };

  return (<form action={category?.suzukiKunAction} method="post" target="_blank" ref={formEl}>
      <input type="hidden"
             value={category?.words.map(w => w.word).join("\n") || ""}
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
      <Button onClick={submitForm} startIcon={<LinkIcon/>} variant="contained"
              color="secondary">

        Open All in Suzuki-Kun
      </Button>
    </form>
  );

}