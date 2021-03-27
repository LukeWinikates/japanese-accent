import React from 'react';
import '@fontsource/roboto';
import './App.css';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {
  AppBar, Box, Breadcrumbs,
  Checkbox,
  Container, Divider, Drawer,
  IconButton, Link,
  List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText,
  Toolbar,
  Typography
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/Inbox';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import {Recorder} from "./Recorder";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const theme = createMuiTheme({});

const items = [
  "おもちゃ",
  "研究",
  "靴",
  "雰囲気",
  "背広",
  "ネクタイ"
];


function handleClick() {

}

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters={true}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                        onClick={handleDrawerOpen}>
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Japanese Accent Practice
            </Typography>
            {/*<Button color="inherit">Login</Button>*/}
          </Toolbar>
        </AppBar>
        <Drawer
          // className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          // classes={{
          //   paper: classes.drawerPaper,
          // }}
        >
          <div
            // className={classes.drawerHeader}
          >
            <IconButton onClick={handleDrawerClose}>
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
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                <ListItemText primary={text}/>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box m={2}>
          <Container maxWidth='lg'>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" onClick={handleClick}>
                /#
              </Link>
              <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
                えほん
              </Link>
              <Typography color="textPrimary"> とうさん まいご （五味太郎）</Typography>
            </Breadcrumbs>

            <Recorder/>
            <List subheader={<li/>}>
              {items.map((item, i) =>
                <ListItem key={`item-${i}`}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      // checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      // inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item}/>
                  <ListItemSecondaryAction>
                    <IconButton edge={false} aria-label="delete">
                      <DeleteIcon/>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>)}

            </List>
          </Container>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
