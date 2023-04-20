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
const updateMALStatus = async (animeId: number, episodeNum: number) => {
  const profileUrl = "https://myanimelist.net/profile/oka1791";
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
    alert("corresponding anime from MAL was not found.");
    return;
  } else {
    updateMALStatus(res.mal_id, res.episodeNum);
  }
});
