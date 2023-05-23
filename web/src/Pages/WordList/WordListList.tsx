import {WordList} from "../../api/types";
import {List} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {Link} from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import React from "react";

export function WordListList({wordLists}:{wordLists: WordList[]}) {
  return <List>
    {wordLists.map(wordList => {
      return (
        <ListItem key={wordList.id}>
          <Link to={`/wordlists/${wordList.id}`}>
            <ListItemText primary={wordList.name} />
          </Link>
        </ListItem>
      );
    })}
  </List>;
}