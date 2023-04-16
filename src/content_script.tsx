const video: HTMLElement = (document.getElementById("video") as HTMLElement);
video.addEventListener("pause", () =>{
  console.log("test");
  const animeTitle = document.getElementsByClassName("pauseInfoTxt1")[0].textContent;
  console.log(animeTitle);
  const animeEpisodeNumber = document.getElementsByClassName("pauseInfoTxt2")[0].textContent;
  console.log(animeEpisodeNumber);
  chrome.runtime.sendMessage({title: animeTitle, episodeNumber: animeEpisodeNumber});
})
