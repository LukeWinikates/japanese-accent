import {WordList} from "../../App/api";
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";

export function WordListList({wordLists}:{wordLists: WordList[]}) {
  return <List>
    {wordLists.map(wordList => {
      return (
        <ListItem key={wordList.id}>
          {/*<ListItemIcon>{<StatusIcon status={video.videoStatus}/>}</ListItemIcon>*/}
          <Link to={`/wordlists/${wordList.id}`}>
            <ListItemText primary={wordList.name} />
          </Link>
        </ListItem>
      );
    })}
  </List>;
}