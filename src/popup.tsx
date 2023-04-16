import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);
  chrome.runtime.onMessage.addListener(async (message) => {
    console.log(message);
    const profileUrl = "https://myanimelist.net/profile/oka1791";
    const results = await axios.get(profileUrl);
    const { data } = results;
    const tmp = document.createElement("div");
    tmp.innerHTML = data;
    // console.log(tmp);
    let csrf_token;
    for (let i = 0; i < tmp.children.length; i++) {
      //console.log(tmp.children[i]);
      if (
        tmp.children[i].tagName == "META" &&
        tmp.children[i].getAttribute("name") == "csrf_token"
      ) {
        csrf_token = tmp.children[i].getAttribute("content");
        break;
      }
    }
    const url = "https://myanimelist.net/ownlist/anime/edit.json";
    axios
      .post(url, {
        anime_id: 2167,
        status: 1,
        score: 0,
        num_watched_episodes: 7,
        csrf_token: csrf_token,
      })
      .then(() => {
        console.log("OK");
      })
      .catch((e) => {
        console.log(e);
      });
  });

  return (
    <>
      <h1>Test</h1>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
