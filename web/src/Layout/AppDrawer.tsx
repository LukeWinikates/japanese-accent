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
import NoteIcon from '@material-ui/icons/Note';
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
  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}>
      <Divider/>
      <List>
        <ListSubheader>Media</ListSubheader>
        {categories.media.map((link, index) => (
          <React.Fragment key={index}>
            <ListItem button>
              <Link to={`/media/${link.videoId}/${link.text}`}>
                <ListItemText primary={link.text}/>
              </Link>
              {/*<ListItemIcon>{<NoteIcon/>}</ListItemIcon>*/}
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      <Divider/>
      <List>
        <ListSubheader>Word Lists</ListSubheader>
        {categories.categories.map((category, index) => (
          <React.Fragment key={index}>
            <ListItem button>
              <Link to={`/category/${encodeURIComponent(category.name.replaceAll("#", ""))}`}>
                <ListItemText primary={category.name}/>
              </Link>
              {/*<ListItemIcon>{<NoteIcon/>}</ListItemIcon>*/}
            </ListItem>
            <List>
              {
                category.categories.map((c, i) => (
                  <ListItem button key={`${index}-${i}`} className={classes.nested}>
                    <ListItemIcon>{<NoteIcon/>}</ListItemIcon>
                    <ListItemText primary={c.name}/>
                  </ListItem>
                ))
              }
            </List>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}