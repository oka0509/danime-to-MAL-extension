const getMALIdAndEpisodeNum = async (
  dAnimeTitle: string,
  episodeNum: number
) => {
  const jikanUrl = `https://api.jikan.moe/v4/anime?q=${dAnimeTitle}`;
  const data = (await (await fetch(jikanUrl)).json()).data[0];
  // dアニメとMALで1対1になっていないことがある。
  // (SPY×FAMILYだとdアニで春期と秋期の放送分が合わさっているが、
  // MALで無印とPart2に分かれている)
  // 話数を超えていたらsequelだとして差分の話数を登録する
  if (episodeNum <= data.episodes) {
    return { mal_id: data.mal_id as number, episodeNum: episodeNum };
  } else {
    const jikanFullInfoUrl = `https://api.jikan.moe/v4/anime/${data.mal_id}/full`;
    const relations = (await (await fetch(jikanFullInfoUrl)).json()).data
      .relations;
    for (const relation of relations) {
      if (relation.relation === "Sequel") {
        const entries = relation.entry;
        for (const entry of entries) {
          if (entry.type === "anime") {
            return {
              mal_id: entry.mal_id as number,
              episodeNum: episodeNum - data.episodes,
            };
          }
        }
      }
    }
    return undefined;
  }
};

type userInfo = { MALUsername: string };
const getSyncStorage = (key: string): Promise<userInfo> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (item: any) => {
      item.hasOwnProperty(key) ? resolve(item) : resolve({ MALUsername: "" });
    });
  });
};
const updateMALStatus = async (animeId: number, episodeNum: number) => {
  const { MALUsername } = await getSyncStorage("MALUsername");
  if (MALUsername === "") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, {
        message: "MALのユーザー名が未登録です><　popupから登録をお願いします",
      });
    });
    return;
  }
  const profileUrl = `https://myanimelist.net/profile/${MALUsername}`;
  const data = await (await fetch(profileUrl)).text();
  const metaTags = data.match(/<meta(?: .+?)?>/g) as RegExpMatchArray;
  let csrf_token;
  for (const metaTag of metaTags) {
    if (metaTag.includes("name='csrf_token'")) {
      const regExp = new RegExp(/<meta\s*.*content\s*=\s*(["'])(.*?)\1.*/);
      const arrs = metaTag.match(regExp);
      if (arrs != null) {
        csrf_token = arrs[2] as string;
      }
      break;
    }
  }
  const postUrl = "https://myanimelist.net/ownlist/anime/edit.json";
  const requestBody = {
    anime_id: animeId,
    status: 1,
    score: 0,
    num_watched_episodes: episodeNum,
    csrf_token: csrf_token,
  };
  fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then(() => {
      console.log("stats successfully updated");
    })
    .catch((e) => {
      console.log(e.message);
    });
};

chrome.runtime.onMessage.addListener(async (message) => {
  const { title, episodeNumber } = message;
  const res = await getMALIdAndEpisodeNum(title, episodeNumber);
  if (res === undefined) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, {
        message: "MALの対応するアニメが見つかりませんでした><",
      });
    });
    return;
  }
  updateMALStatus(res.mal_id, res.episodeNum);
});
