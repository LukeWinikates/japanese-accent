import {Route, Switch} from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import CategoryPage from "../Pages/CategoryPage";
import {YoutubeVideoPage} from "../Pages/YouTube/YoutubeVideoPage";
import {PlaylistPage} from "../Pages/Playlist/PlaylistPage";
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