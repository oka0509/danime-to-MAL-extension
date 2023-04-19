const video: HTMLElement = document.getElementById("video") as HTMLElement;
video.addEventListener("pause", () => {
  const Title = document.getElementsByClassName("pauseInfoTxt1")[0].textContent;
  const episodeNumber = document.getElementsByClassName("pauseInfoTxt2")[0]
    .textContent as string;
  const regex = /[^0-9]/g;
  chrome.runtime.sendMessage({
    title: Title,
    episodeNumber: parseInt(episodeNumber.replace(regex, "")),
  });
});
