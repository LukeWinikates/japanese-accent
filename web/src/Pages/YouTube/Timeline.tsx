import React from "react";
import {VttSegment} from "../../App/api";
import {useTheme} from "@material-ui/core";

type TimelineProps = {
  duration: number,
  segments?: VttSegment[],
}

const secondsWidth = 10;

export function Timeline({duration, segments}: TimelineProps) {
  const theme = useTheme();

  return (
    <div style={{overflowX: "scroll"}}>
      <svg style={{display: "inline-block", width: 20 + duration * secondsWidth, height: 140}}>

        {/*{*/}
        {/*  points.map((p, i) => {*/}
        {/*    return <circle key={`point-${i}`} cx={p.x} cy={p.y} r="5" fill={theme.palette.primary.light}/>*/}
        {/*  })*/}
        {/*}*/}
        {/*<path fill="theme.palette.primary.light" stroke={theme.palette.primary.light}*/}
        {/*      strokeWidth={2} d={path}/>*/}

        <rect width={duration * secondsWidth}
              x={10}
              height={20}
              y={10}
              strokeWidth={1}
              stroke={theme.palette.primary.dark}
              fill={"none"}
              />

        <rect width={duration * secondsWidth}
              x={10}
              height={20}
              y={70}
              fill={theme.palette.primary.main}/>

        {/*{*/}
        {/*  morae.map((m, i) => {*/}
        {/*    return (*/}
        {/*      <text y="60"*/}
        {/*            style={{*/}
        {/*              fill: pattern[i] === 'k' ? theme.palette.primary.light : theme.palette.grey["700"],*/}
        {/*              fontWeight: pattern[i] === 'k' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,*/}
        {/*              fontSize: 16,*/}
        {/*              textAlign: "center"*/}
        {/*            }}*/}
        {/*            key={`text-${i}`}*/}
        {/*            x={`${(i * moraWidth) + 10}`}>*/}
        {/*        {m}*/}
        {/*      </text>);*/}
        {/*  })*/}
        {/*}*/}
      </svg>
    </div>);

}