const getMALIdAndEpisodeNum = async (
  dAnimeTitle: string,
  episodeNum: number
) => {};
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
  //await getMALIdAndEpisodeNum(title, episodeNumber);
  updateMALStatus(2167, 7);
});
