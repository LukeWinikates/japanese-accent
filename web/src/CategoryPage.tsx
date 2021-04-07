import React from "react";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Checkbox,
  Container,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import {Recorder} from "./Recorder";
import DeleteIcon from '@material-ui/icons/Delete'


function handleClick() {

}

const items = [
  "おもちゃ",
  "研究",
  "靴",
  "雰囲気",
  "背広",
  "ネクタイ"
];

function CategoryPage() {
  return (
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

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            とうさん まいご （五味太郎）
          </Typography>


          <Box paddingY={2} width={1 / 3}>
            <Typography variant="h4">
              Recordings
            </Typography>
            <Box paddingY={2}>
              <Recorder/>
            </Box>
          </Box>
        </Box>


        <Box paddingY={2} width={3 / 4}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                Practice Items
              </Typography>
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
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default CategoryPage;
