import React, {useState} from "react";

export const DragDropComposableText = ({text}: { text: string }) => {
  const lines = text.split("\n");
  const [capturedText, setCapturedText] = useState<string | undefined>();


  function captureSelection() {
    let selection = document.getSelection();
    if (!selection) {
      return
    }
    setCapturedText(selection.toString());
  }

  return <div onMouseUp={captureSelection}>
    {capturedText &&
    <div>{capturedText}</div>
    }
    {
      lines.map((l, idx) => {
        return <p key={idx}> {l} </p>
      })
    }
  </div>;
}