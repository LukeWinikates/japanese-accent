import React from 'react';
import {CategoriesResponse} from "../api";
import {makeStyles} from '@material-ui/core/styles';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@material-ui/core";
import HouseIcon from '@material-ui/icons/House';
import YoutubeIcon from '@material-ui/icons/YouTube';
import NotesIcon from '@material-ui/icons/Notes';
import {Link} from "react-router-dom";

type AppDrawerProps = {
  categories: CategoriesResponse,
  open: boolean,
  handleClose: () => void,
  theme: any,
}

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

export function DummyDrawer() {
  return (
    <div></div>
  );
}

export function AppDrawer({categories, open, handleClose, theme}: AppDrawerProps) {
  const classes = useStyles({
    listSection: {
      backgroundColor: 'inherit',
    },
  });

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}>
      <List>
        <ListItem button>
          <ListItemIcon>
            <HouseIcon />
          </ListItemIcon>
          <Link to={`/`}>
            <ListItemText primary="Home"/>
          </Link>
        </ListItem>
      </List>
      <Divider/>
      <List>
        <ListSubheader disableSticky={true}>Media</ListSubheader>
        {categories.media.map((link, index) => (
          <React.Fragment key={index}>
            <ListItem button>
              <ListItemIcon>{<YoutubeIcon/>}</ListItemIcon>
              <Link to={`/media/${link.videoId}/${link.text}`}>
                <ListItemText primary={link.text}/>
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