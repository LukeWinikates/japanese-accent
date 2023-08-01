import React, {ChangeEvent, useCallback, useState} from "react";
import {Stack, TextField} from "@mui/material";
import ReactMarkdown from 'react-markdown'


export const LessonEditorPage = () => {
  const [text, setText] = useState("")
  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setText(e.target.value);
  }, [setText]);

  return (
    <Stack>
      <TextField multiline fullWidth onChange={onChange}/>
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </Stack>
  );
};
