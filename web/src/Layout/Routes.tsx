import {Route, Switch} from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import {YoutubeVideoPage} from "../Pages/YouTube/YoutubeVideoPage";
import {PlaylistPage} from "../Pages/Playlist/PlaylistPage";
import React from "react";
import VideosIndexPage from "../Pages/VideosIndex/VideosIndexPage";
import WordListPage from "../Pages/WordList/WordListPage";
import WordListsIndexPage from "../Pages/WordList/WordListsIndexPage";

export function Routes() {
  return <Switch>
    <Route exact path="/">
      <HomePage/>
    </Route>
    <Route path="/media/:id">
      <YoutubeVideoPage/>
    </Route>
    <Route path="/videos">
      <VideosIndexPage/>
    </Route>
    <Route path="/playlists/:id">
      <PlaylistPage/>
    </Route>
    <Route path="/wordlists/:id">
      <WordListPage/>
    </Route>
    <Route path="/wordlists">
      <WordListsIndexPage/>
    </Route>
  </Switch>;
}