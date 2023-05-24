import React, {useEffect, useState} from 'react';
import {Highlights} from "../api/types";
import {Divider, Drawer, Link, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader} from "@mui/material";
import HouseIcon from '@mui/icons-material/House';
import YoutubeIcon from '@mui/icons-material/YouTube';
import NotesIcon from '@mui/icons-material/Notes';
import {Link as RouterLink} from "react-router-dom";
import {Loadable} from "../App/loadable";
import {highlightsGET} from "../api/ApiRoutes";

type AppDrawerProps = {
  open: boolean,
  onClose: () => void,
}

export function DummyDrawer() {
  return (
    <div/>
  );
}

export function AppDrawer({open, onClose}: AppDrawerProps) {
  const [highlights, setHighlights] = useState<Loadable<Highlights>>("loading");

  useEffect(() => {
    highlightsGET().then(r => setHighlights({data: r.data}))
  }, [setHighlights]);

  if (highlights === "loading") {
    return (<DummyDrawer/>);
  }

  const categories = highlights.data;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClick={onClose}
      onClose={onClose}>
      <List>
        <ListItemButton>
          <ListItemIcon>
            <HouseIcon/>
          </ListItemIcon>
          <Link component={RouterLink} to="/">
            <ListItemText primary="Home"/>
          </Link>
        </ListItemButton>
      </List>
      <Divider/>
      <List>
        <ListSubheader disableSticky={true}>
          Videos <RouterLink to="/videos">(see all)</RouterLink>
        </ListSubheader>
        {categories.videos.map((video, index) => (
          <React.Fragment key={index}>
            <ListItemButton>
              <ListItemIcon>{<YoutubeIcon/>}</ListItemIcon>
              <Link component={RouterLink} to={`/media/${video.videoId}`}>
                <ListItemText primary={video.title}/>
              </Link>
            </ListItemButton>
          </React.Fragment>
        ))}
      </List>
      <Divider/>
      <List>
        <ListSubheader disableSticky={true}>
          Word Lists <RouterLink to="/wordlists">(see all)</RouterLink>
        </ListSubheader>
        {categories.wordLists.map((wordList, index) => (
          <React.Fragment key={index}>
            <ListItemButton>
              <ListItemIcon><NotesIcon/></ListItemIcon>
              <Link component={RouterLink} to={`/wordlists/${wordList.id}`}>
                <ListItemText primary={wordList.name}/>
              </Link>
            </ListItemButton>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}