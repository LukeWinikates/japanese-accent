import React, {useEffect, useState} from 'react';
import {CategoriesResponse} from "../App/api";
import {Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader} from "@material-ui/core";
import HouseIcon from '@material-ui/icons/House';
import YoutubeIcon from '@material-ui/icons/YouTube';
import NotesIcon from '@material-ui/icons/Notes';
import {Link} from "react-router-dom";
import useFetch from "use-http";

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
  const [categories, setCategories] = useState<CategoriesResponse | null>(null);
  // const {setter: setStatus} = useStatus();

  const {get, response} = useFetch('/api/categories');

  async function initialize() {
    const initialCategories = await get('');
    if (response.ok) setCategories(initialCategories);
  }

  useEffect(() => {
    initialize()
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
        <ListSubheader disableSticky={true}>Media</ListSubheader>
        {categories.media.map((video, index) => (
          <React.Fragment key={index}>
            <ListItem button>
              <ListItemIcon>{<YoutubeIcon/>}</ListItemIcon>
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
        {categories.categories.map((category, index) => (
          <React.Fragment key={index}>
            <ListItem button>
              <ListItemIcon><NotesIcon/></ListItemIcon>
              <Link to={`/category/${encodeURIComponent(category.name.replaceAll("#", ""))}`}>
                <ListItemText primary={category.name}/>
              </Link>
            </ListItem>
            {/*<List>*/}
            {/*  {*/}
            {/*    category.categories.map((c, i) => (*/}
            {/*      <ListItem button key={`${index}-${i}`} className={classes.nested}>*/}
            {/*        <ListItemIcon>{<NoteIcon/>}</ListItemIcon>*/}
            {/*        <ListItemText primary={c.name}/>*/}
            {/*      </ListItem>*/}
            {/*    ))*/}
            {/*  }*/}
            {/*</List>*/}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}