import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {CircularProgress, TextField} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";
import {useServerInteractionHistory} from "../../App/useServerInteractionHistory";

const Indicator = ({status}: { status: IndicatorStatus }) => {
  switch (status) {
    case "busy":
      return <CircularProgress size={16} color="inherit" style={{padding: 5}}/>;
    case "error":
      return <ErrorIcon/>;
    case "idle":
      return <></>
    case "success":
      return <CheckIcon color="primary"/>;
  }
}
export type IndicatorStatus = "idle" | "busy" | "success" | "error";

type AutoSavingTextFieldProps<T> = { setText: (newValue: string) => void, value: string, save: () => Promise<T> };

export function AutoSavingTextField<T>({setText, value, save}: AutoSavingTextFieldProps<T>) {
  const [networkActivity, setNetworkActivity] = useState<IndicatorStatus>("idle");
  const [lastTextEditTime, setLastTextEditTime] = useState<Date | undefined>();
  const {logError} = useServerInteractionHistory();
  const saveText = useCallback(() => {
    save().then(() => setNetworkActivity("success")).catch(e => {
      logError(e);
      setNetworkActivity("error")
    });
  }, [save, logError, setNetworkActivity]);

  useEffect(() => {
    if (!lastTextEditTime) {
      return
    }
    const timer = setTimeout(() => {
      saveText();
    }, 2000);
    return () => clearTimeout(timer);
  }, [lastTextEditTime, saveText])

  const changeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNetworkActivity("busy")
    const {value} = event.target;
    setText(value);
    setLastTextEditTime(new Date());
  }

  return <>
    <TextField multiline rows={15} fullWidth variant='outlined' onChange={changeHandler} value={value}/>
    <Indicator status={networkActivity}/>
  </>;
}