import {Route, Routes as RRoutes} from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import {YoutubeVideoPage} from "../Pages/YouTube/YoutubeVideoPage";
import {PlaylistPage} from "../Pages/Playlist/PlaylistPage";
import React from "react";
import VideosIndexPage from "../Pages/VideosIndex/VideosIndexPage";
import {VideoClipsEditPage} from "../Pages/VideoClipsEdit/VideoClipsEditPage";
import WordListPage from "../Pages/WordList/WordListPage";
import WordListsIndexPage from "../Pages/WordList/WordListsIndexPage";

export function Routes() {
  return <RRoutes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/media/:id" element={<YoutubeVideoPage/>}/>
    <Route path="/media/:id/edit" element={<VideoClipsEditPage/>}/>
    <Route path="/videos" element={<VideosIndexPage/>}/>
    <Route path="/playlists/:id" element={<PlaylistPage/>}/>
    <Route path="/wordlists/:id" element={<WordListPage/>}/>
    <Route path="/wordlists" element={<WordListsIndexPage/>}/>
  </RRoutes>;
}