const video: HTMLElement = document.getElementById("video") as HTMLElement;
video.addEventListener("pause", () => {
  const animeTitle =
    document.getElementsByClassName("pauseInfoTxt1")[0].textContent;
  const animeEpisodeNumber =
    document.getElementsByClassName("pauseInfoTxt2")[0].textContent;
  chrome.runtime.sendMessage({
    title: animeTitle,
    episodeNumber: animeEpisodeNumber,
  });
});
