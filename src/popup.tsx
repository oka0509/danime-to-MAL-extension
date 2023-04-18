import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const Popup = () => {
  const getMALIdAndEpisodeNum = (dAnimeTitle: string, episodeNum: number) => {};
  const updateMALStatus = async (animeId: number, episodeNum: number) => {
    const profileUrl = "https://myanimelist.net/profile/oka1791";
    const { data } = await axios.get(profileUrl);
    const tmp = document.createElement("div");
    tmp.innerHTML = data;
    let csrf_token;
    for (let i = 0; i < tmp.children.length; i++) {
      if (
        tmp.children[i].tagName === "META" &&
        tmp.children[i].getAttribute("name") === "csrf_token"
      ) {
        csrf_token = tmp.children[i].getAttribute("content");
        break;
      }
    }
    const postUrl = "https://myanimelist.net/ownlist/anime/edit.json";
    axios
      .post(postUrl, {
        anime_id: animeId,
        status: 1,
        score: 0,
        num_watched_episodes: episodeNum,
        csrf_token: csrf_token,
      })
      .then(() => {
        console.log("stats successfully updated");
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  chrome.runtime.onMessage.addListener(async () => {
    updateMALStatus(2167, 7);
  });

  return <h1>Test</h1>;
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
