import {Button, FormControl, Input, InputLabel} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import React from "react";
import {msToHumanReadable} from "./time";

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
  return (
    <FormControl margin="normal">
      <InputLabel>{label}</InputLabel>
      <Input
        startAdornment={
          <InputAdornment position="start">
            <Button size="small" variant="outlined" onClick={() => onChange(value - 1000)}>
              -1s
            </Button>
            <Button size="small" variant="outlined" onClick={() => onChange(value - 500)}>
              -.5s
            </Button>
            <Button size="small" variant="outlined" onClick={() => onChange(value - 100)}>
              -.1s
            </Button>
          </InputAdornment>}
        endAdornment={
          <InputAdornment position="end">
            <Button size="small" variant="outlined" onClick={() => onChange(value + 100)}>
              +.1s
            </Button>
            <Button size="small" variant="outlined" onClick={() => onChange(value + 500)}>
              +.5s
            </Button>
            <Button size="small" variant="outlined" onClick={() => onChange(value + 1000)}>
              +1s
            </Button>
          </InputAdornment>}
        onChange={(event) => onChange(parseUserInput(event.target.value))}
        value={msToHumanReadable(value)}/>
    </FormControl>
  );
}