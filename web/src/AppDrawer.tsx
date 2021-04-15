import React from 'react';
import {Category} from "./api";
import {makeStyles} from '@material-ui/core/styles';
import {Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import InboxIcon from '@material-ui/icons/Inbox';
import MailIcon from '@material-ui/icons/Mail';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import NoteIcon from '@material-ui/icons/Note';
import {Link} from "react-router-dom";

type AppDrawerProps = {
  categories: Category[],
  open: boolean,
  handleClose: () => void,
  theme: any,
}
const drawerWidth = 440;

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

export function AppDrawer({categories, open, handleClose, theme}: AppDrawerProps) {
  const classes = useStyles();

  return (

    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div
        className={classes.drawerHeader}
      >
        <IconButton onClick={handleClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
        </IconButton>
      </div>
      <Divider/>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        ))}
      </List>
      <Divider/>
      <List>
        {categories.map((category, index) => (
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