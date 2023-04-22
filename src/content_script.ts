const video: HTMLElement = document.getElementById("video") as HTMLElement;
const replaceFullToHalf = (str: string) => {
  return str.replace(/[！-～]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
};
video.addEventListener("pause", () => {
  let Title = document.getElementsByClassName("pauseInfoTxt1")[0]
    .textContent as string;
  Title = replaceFullToHalf(Title);
  const episodeNumber = document.getElementsByClassName("pauseInfoTxt2")[0]
    .textContent as string;
  const regex = /[^0-9]/g;
  chrome.runtime.sendMessage({
    title: Title,
    episodeNumber: parseInt(episodeNumber.replace(regex, "")),
  });
});

chrome.runtime.onMessage.addListener((request) => {
  alert(request.message);
});
