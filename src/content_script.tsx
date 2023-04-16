chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.color) {
   // document.body.style.backgroundColor = "red";
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
  //  document.body.style.backgroundColor = "red";
    sendResponse("Color message is none.");
  }
  return true;
});

const video: HTMLElement = (document.getElementById("video") as HTMLElement);
video.addEventListener("pause", () =>{
  console.log("test");
  chrome.runtime.sendMessage({message: "test"});
})
