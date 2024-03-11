import React, {useState} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import {TimeInput} from "./TimeInput";

describe("TimeInput", () => {
  test('supports tweaking the time by set intervals', async () => {
    const Wrapper = () => {
      const [value, setValue] = useState(2 * 60 * 1000);
      return (
        <TimeInput value={value} label={"beginning"} onChange={setValue}/>
      )
    }

    render(
      <Wrapper/>
    );

    fireEvent.click(screen.getByText("-1s"));
    expect(screen.getByRole("textbox")).toHaveValue("1:59.0")

    fireEvent.click(screen.getByText("+.5s"));
    expect(screen.getByRole("textbox")).toHaveValue("1:59.5")
  });
});
