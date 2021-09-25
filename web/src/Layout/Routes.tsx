import {Route, Switch} from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import CategoryPage from "../VocabularyPractice/CategoryPage";
import {YoutubeVideoPage} from "../MediaPractice/YoutubeVideoPage";
import {PlaylistPage} from "../Playlist/PlaylistPage";
import React from "react";

export function Routes() {
  return <Switch>
    <Route exact path="/">
      <HomePage/>
    </Route>
    <Route path="/category/*">
      <CategoryPage/>
    </Route>
    <Route path="/media/:id">
      <YoutubeVideoPage/>
    </Route>
    <Route path="/playlists/:id">
      <PlaylistPage/>
    </Route>
  </Switch>;
}