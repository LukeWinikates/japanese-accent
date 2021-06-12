import {Word} from "./api";
import {useTheme} from "@material-ui/core";
import React from "react";

function moraAccentHigh(word: Word, index: number) {
  if (!!word.accentMora) {
    if (index === 0 && word.accentMora !== 1) {
      return false;
    }

    return index + 1 <= word.accentMora;
  } else {
    // heiban starts low, the rest are high
    return index > 0;
  }
}

export function MoraSVG({word}: {
  word: Word
}) {
  const theme = useTheme();
  const moraWidth = 40;
  const high = 10;
  const low = 30;


  const points = word.morae.map((m, i) => {
    const x = 20 + (i * moraWidth);
    const y = word.accentMora !== null && moraAccentHigh(word, i) ? high : low;
    return {x, y}
  });

  const strokeDashes = word.accentMora !== null ? "1 0" : "1 1";

  const path = points.map(({x, y}, i) => `${i === 0 ? "M" : "L"} ${x},${y}`).join("\n");


  return (
    <svg style={{display: "inline-block", width: 8 * moraWidth, height: 80}}>

      {
        word.accentMora !== null ?
          points.map((p, i) => {
            return <circle key={`point-${i}`} cx={p.x} cy={p.y} r="5" fill={theme.palette.primary.light}/>
          }) : <></>
      }
      <path fill="none" stroke={theme.palette.primary.light} strokeDasharray={strokeDashes} strokeWidth={2} d={path}/>

      {
        word.morae.map((m, i) => {
          return (
            <text y="60"
                  style={{
                    fill: i + 1 === word.accentMora ? theme.palette.primary.light : theme.palette.grey["700"],
                    fontWeight: i + 1 === word.accentMora ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                    fontSize: 16,
                    textAlign: "center"
                  }}
                  key={`text-${i}`}
                  x={`${i * moraWidth + 10}`}>
              {m}
            </text>);
        })
      }
    </svg>
  );
}