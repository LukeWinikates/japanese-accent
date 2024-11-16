import React from 'react';
import {
  Drawer,
  List,
  ListItem, Typography, Box
} from "@mui/material";
import {HistoryEvent} from "../App/useServerInteractionHistory";

type HistoryDrawerProps = {
  open: boolean,
  onClose: () => void,
  history: HistoryEvent[]
}

export function HistoryDrawer({open, onClose, history}: HistoryDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClick={onClose}
      onClose={onClose}>
      <Box sx={{width: 250}}>
        <Typography variant="h6">
          Recent Events
        </Typography>
        <List>
          {
            history.map((h) => {
              return (
                <ListItem key={h.time.valueOf()}>
                  {h.text}
                </ListItem>
              )
            })
          }
        </List>
      </Box>
    </Drawer>
  );
}