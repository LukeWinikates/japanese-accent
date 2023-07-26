import {Clip, durationSeconds} from "../api/types";
import React, {useCallback} from "react";
import {ListItemButton} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";

type RowProps = {
  clip: Clip,
  index: number,
  isCurrent: boolean,
  onSelectClip: (index: number) => void,
}

export const PlaylistRow = ({clip, index, onSelectClip, isCurrent}: RowProps) => {
  const onClick = useCallback(() => {
    onSelectClip(index);
  }, [onSelectClip, index]);

  return (
    <ListItemButton key={index}
                    selected={isCurrent}
                    alignItems="flex-start"
                    onClick={onClick}
    >
      <ListItemText
        primaryTypographyProps={{noWrap: true, variant: "body2"}}
        primary={clip.text}
        secondary={Math.round(durationSeconds(clip)) + "s"}
      >
      </ListItemText>
    </ListItemButton>
  );
}