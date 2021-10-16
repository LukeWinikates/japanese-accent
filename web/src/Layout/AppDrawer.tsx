import React, {useEffect, useState} from 'react';
import {Highlights} from "../App/api";
import {Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader} from "@material-ui/core";
import HouseIcon from '@material-ui/icons/House';
import YoutubeIcon from '@material-ui/icons/YouTube';
import NotesIcon from '@material-ui/icons/Notes';
import {Link} from "react-router-dom";
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
      onClose={handleClose}>
      <List>
        <ListItem button>
          <ListItemIcon>
            <HouseIcon/>
          </ListItemIcon>
          <Link to={`/`}>
            <ListItemText primary="Home"/>
          </Link>
        </ListItem>
      </List>
      <Divider/>
      <List>
        <ListSubheader disableSticky={true}>Videos</ListSubheader>
        {categories.videos.map((video, index) => (
          <React.Fragment key={index}>
            <ListItem button>
              <ListItemIcon>{<YoutubeIcon/>}</ListItemIcon>
              <ListItemIcon><StatusIcon status={video.videoStatus} /></ListItemIcon>
              <Link to={`/media/${video.videoId}`}>
                <ListItemText primary={video.title}/>
              </Link>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      <Divider/>
      <List>
        <ListSubheader disableSticky={true}>Word Lists</ListSubheader>
        {categories.wordLists.map((wordList, index) => (
          <React.Fragment key={index}>
            <ListItem button>
              <ListItemIcon><NotesIcon/></ListItemIcon>
              <Link to={`/wordlists/${wordList.id}`}>
                <ListItemText primary={wordList.name}/>
              </Link>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}