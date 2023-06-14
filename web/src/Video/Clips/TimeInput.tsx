import {Button, FormControl, Input, InputLabel} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import React, {ChangeEvent, useCallback} from "react";
import {msToHumanReadable} from "../../App/time";

interface TimeInputProps {
  onChange: (newTime: number) => void,
  value: number,
  label: string,
}

function parseUserInput(value: string): number {
  const [totalSeconds, msString] = value.split('.');
  const [minutesString, secondsString] = totalSeconds.split(":");

  return (+minutesString * 60 * 1000) + (+secondsString * 1000) + (+msString);
}

export function TimeInput({value, onChange, label}: TimeInputProps) {
  let backOneSecond = useCallback(() => onChange(value - 1000), [value, onChange]);
  let backHalfSecond = useCallback(() => onChange(value - 500), [value, onChange]);
  let back100ms = useCallback(() => onChange(value - 100), [value, onChange]);
  let ahead100ms = useCallback(() => onChange(value + 100), [value, onChange]);
  let aheadHalfSecond = useCallback(() => onChange(value + 500), [value, onChange]);
  let aheadOneSecond = useCallback(() => onChange(value + 1000), [value, onChange]);
  let onChangeCallback = useCallback((event:ChangeEvent<HTMLInputElement>) => onChange(parseUserInput(event.target.value)), [onChange]);

  return (
    <FormControl margin="normal">
      <InputLabel>{label}</InputLabel>
      <Input
        startAdornment={
          <InputAdornment position="start">
            <Button size="small" variant="outlined" onClick={backOneSecond}>
              -1s
            </Button>
            <Button size="small" variant="outlined" onClick={backHalfSecond}>
              -.5s
            </Button>
            <Button size="small" variant="outlined" onClick={back100ms}>
              -.1s
            </Button>
          </InputAdornment>}
        endAdornment={
          <InputAdornment position="end">
            <Button size="small" variant="outlined" onClick={ahead100ms}>
              +.1s
            </Button>
            <Button size="small" variant="outlined" onClick={aheadHalfSecond}>
              +.5s
            </Button>
            <Button size="small" variant="outlined" onClick={aheadOneSecond}>
              +1s
            </Button>
          </InputAdornment>}
        onChange={onChangeCallback}
        value={msToHumanReadable(value)}/>
    </FormControl>
  );
}