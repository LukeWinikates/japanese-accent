import React, {useEffect, useState} from 'react';
import {Highlights} from "../App/api";
import {Divider, Drawer, Link, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader} from "@mui/material";
import HouseIcon from '@mui/icons-material/House';
import YoutubeIcon from '@mui/icons-material/YouTube';
import NotesIcon from '@mui/icons-material/Notes';
import {Link as RouterLink} from "react-router-dom";
import useFetch from "use-http";
import {StatusIcon} from "../Video/StatusIcon";
import {useServerInteractionHistory} from "./useServerInteractionHistory";

type AppDrawerProps = {
  open: boolean,
  handleClose: () => void,
}

export function DummyDrawer() {
  return (
    <div/>
  );
}

export function AppDrawer({open, handleClose}: AppDrawerProps) {
  const [categories, setCategories] = useState<Highlights | null>(null);
  const {logError} = useServerInteractionHistory();

  const {get, response} = useFetch('/api/highlights');

  async function initialize() {
    const initialCategories = await get('');
    if (response.ok) setCategories(initialCategories);
  }

  useEffect(() => {
    initialize().catch(logError)
  }, []);

  if (categories === null) {
    return (<DummyDrawer/>);
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClick={handleClose}
      onClose={handleClose}>
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
              <ListItemIcon><StatusIcon status={video.videoStatus} /></ListItemIcon>
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