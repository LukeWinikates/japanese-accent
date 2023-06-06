import React from 'react';
import {Highlights} from "../api/types";
import {Divider, Drawer, Link, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader,} from "@mui/material";
import HouseIcon from '@mui/icons-material/House';
import YoutubeIcon from '@mui/icons-material/YouTube';
import NotesIcon from '@mui/icons-material/Notes';
import {Link as RouterLink} from "react-router-dom";
import {useBackendAPI} from "../App/useBackendAPI";
import {Loader, Settable} from "../App/Loader";

type AppDrawerProps = {
  open: boolean,
  onClose: () => void,
}

function LoadedDrawer({value}: Settable<Highlights>) {
  return (
    <>
      <List>
        <ListSubheader disableSticky={true}>
          Videos <RouterLink to="/videos">(see all)</RouterLink>
        </ListSubheader>
        {value.videos.map((video, index) => (
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
        {value.wordLists.map((wordList, index) => (
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
    </>
  );
}

export function AppDrawer({open, onClose}: AppDrawerProps) {
  const api = useBackendAPI();
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
      <Loader callback={api.highlights.GET} into={LoadedDrawer}/>
    </Drawer>
  );
}
