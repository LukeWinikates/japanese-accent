import {Word} from "../api/types";
import {useTheme} from "@mui/material";
import React from "react";
import {makeStyles} from "tss-react/mui";

function moraAccentHigh(word: Word, index: number) {
  if (word.accentMora) {
    if (index === 0 && word.accentMora !== 1) {
      return false;
    }

    return index + 1 <= word.accentMora;
  } else {
    // heiban starts low, the rest are high
    return index > 0;
  }
}

const moraWidth = 40;
const high = 10;
const low = 30;
const height = 80;

const useStyles = makeStyles<void>()(() => ({
  moraSVG: {
    display: 'inline-block',
    height: height
  }
}));

export function WordMoraSVG({word}: {
  word: Word
}) {
  const theme = useTheme();
  const {classes} = useStyles();

  const points = word.morae.map((m, i) => {
    const x = 20 + (i * moraWidth);
    const y = word.accentMora !== null && moraAccentHigh(word, i) ? high : low;
    return {x, y}
  });

  const strokeDashes = word.accentMora !== null ? "1 0" : "1 1";

  const path = points.map(({x, y}, i) => `${i === 0 ? "M" : "L"} ${x},${y}`).join("\n");


  return (
    <svg className={classes.moraSVG} style={{width: 8 * moraWidth}}>

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

export function RawMoraSVG({morae, pattern}: { morae: string[], pattern: string }) {
  const theme = useTheme();
  const {classes} = useStyles();

  const points = pattern.split("").map((m, i) => {
    const x = 20 + (i * moraWidth);
    const y = m === 'h' || m === 'k' ? high : low;
    return {x, y}
  });

  const path = points.map(({x, y}, i) => `${i === 0 ? "M" : "L"} ${x},${y}`).join("\n");

  return (
    <svg className={classes.moraSVG} style={{width: morae.length * moraWidth}}>

      {
        points.map((p, i) => {
          return <circle key={`point-${i}`} cx={p.x} cy={p.y} r="5" fill={theme.palette.primary.light}/>
        })
      }
      <path fill="none" stroke={theme.palette.primary.light} strokeDasharray={"1 1"} strokeWidth={2} d={path}/>

      {
        morae.map((m, i) => {
          return (
            <text y="60"
                  style={{
                    fill: pattern[i] === 'k' ? theme.palette.primary.light : theme.palette.grey["700"],
                    fontWeight: pattern[i] === 'k' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                    fontSize: 16,
                    textAlign: "center"
                  }}
                  key={`text-${i}`}
                  x={`${(i * moraWidth) + 10}`}>
              {m}
            </text>);
        })
      }
    </svg>);
}

export function SkeletonMoraSVG() {
  const theme = useTheme();
  const points = [1, 2, 3, 4, 5].map((m, i) => {
    const x = 20 + (i * moraWidth);
    const y = low;
    return {x, y}
  });
  const {classes} = useStyles();
  const path = points.map(({x, y}, i) => `${i === 0 ? "M" : "L"} ${x},${y}`).join("\n");

  return (
    <svg className={classes.moraSVG} style={{width: 5 * moraWidth}}>

      {
        points.map((p, i) => {
          return <circle key={`point-${i}`} cx={p.x} cy={p.y} r="5" fill={theme.palette.grey["700"]}/>
        })
      }
      <path fill="none" stroke={theme.palette.grey["700"]} strokeDasharray={"1 1"} strokeWidth={2} d={path}/>

      {
        "     ".split("").map((m, i) => {
          return (
            <text y="60"
                  style={{
                    fill: theme.palette.grey["700"],
                    fontSize: 16,
                    textAlign: "center"
                  }}
                  key={`text-${i}`}
                  x={`${(i * moraWidth) + 10}`}>
              {m}
            </text>);
        })
      }
    </svg>);
}