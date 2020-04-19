let currentVideo, timeout;
const timerDefaultLength = 1000;
const videoPlayBackToastId = "video-playback-toast";
const styles =
  "#video-playback-toast {display: none;}" +
  "#video-playback-toast.active {" +
  "display: block;" +
  "position: absolute;" +
  "top: 0;" +
  "left: 0;" +
  "border: 1px solid #000;" +
  "border-radius: 4px;" +
  "padding: 8px 16px;" +
  "font-size: 12px;" +
  "color: #DBE9E8;" +
  "background-color: rgba(69,75,105, 0.5);" +
  "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue';" +
  "}";

let skipAmount = 10, incrementAmount = 0.1;
  chrome.storage.sync.get(["playBackRate", "skipDuration"], function (result) {
    const {playBackRate, skipDuration} = result
    if(playBackRate) {
      incrementAmount = Number((playBackRate / 100).toFixed(2))
    }
    if(skipDuration) {
      skipAmount = Number(skipDuration)
    }
  });


function setCurrentVideo(video) {
  if (
    !currentVideo ||
    !currentVideo.dataset ||
    !currentVideo.dataset.videoId ||
    currentVideo.dataset.videoId !== video.dataset.videoId
  ) {
    // remove any old toasts
    // should only be one but just in case
    const oldToasts = document.getElementsByClassName("video-play-back-toast");
    for (const toast of oldToasts) {
      toast.remove();
    }

    currentVideo = video;
    const videoPBToast = document.createElement("div");
    videoPBToast.setAttribute("id", videoPlayBackToastId);
    videoPBToast.setAttribute("class", "video-play-back-toast");
    currentVideo.parentElement.appendChild(videoPBToast);
  }
}

function setVideos() {
  const videos = Array.from(document.getElementsByTagName("video"));
  if (videos && videos.length) {
    for (const [index, video] of videos.entries()) {
      // set a data attribute so we can tell if the currentVideo is the same
      video.setAttribute("data-video-id", index + 1);
      // set the first video as the currentVideo
      if (!index) {
        setCurrentVideo(video);
      }
      video.addEventListener("play", function () {
        setCurrentVideo(video);
      });
    }
    document.addEventListener("keydown", handleKeyDown);
    const head = document.getElementsByTagName("HEAD")[0];
    const stylesheet = document.createElement("style");
    stylesheet.innerHTML = styles;
    head.appendChild(stylesheet);
  }
}
setVideos()
chrome.runtime.onMessage.addListener(data => {
  if (data.action === "pageChange") {
    setVideos()
  }
});

function closeToast(toast) {
  toast.classList.remove("active");
}

function openToast(text) {
  const toast = document.getElementById(videoPlayBackToastId);
  const toastIsShowing = toast.classList.contains("active");
  if (toastIsShowing) {
    clearTimeout(timeout);
  } else {
    toast.classList.add("active");
  }
  toast.innerHTML = text;
  timeout = setTimeout(() => closeToast(toast), timerDefaultLength);
}

function formatTimeStamp(timeInSeconds) {
  const num = Number(timeInSeconds)
  const minutes = Math.floor(num / 60)
  const seconds = num - minutes * 60;
  let secondsString = seconds.toFixed(0).toString()
  if(secondsString.length === 1) {
    secondsString = "0" + secondsString
  }
  return `${minutes}:${secondsString}`
}

function handleKeyDown(e) {
  if (!currentVideo) return null;
  let showToast = true, text;
  switch (e.code) {
    case "KeyD":
      text = `${Number((currentVideo.playbackRate + incrementAmount) * 100).toFixed(0)}%`
      currentVideo.playbackRate = currentVideo.playbackRate + incrementAmount;
      break;
    case "KeyS":
      text = `${Number((currentVideo.playbackRate - incrementAmount) * 100).toFixed(0)}%`
      currentVideo.playbackRate = currentVideo.playbackRate - incrementAmount;
      break;
    case "KeyR":
      text = "100%"
      currentVideo.playbackRate = 1;
      break;
    case "KeyX":
      text = formatTimeStamp(currentVideo.currentTime + skipAmount);
      currentVideo.currentTime = currentVideo.currentTime + skipAmount;
      break;
    case "KeyZ":
      text = formatTimeStamp(currentVideo.currentTime - skipAmount);
      currentVideo.currentTime = currentVideo.currentTime - skipAmount;
      break;
    default:
      showToast = false
      break;
  }
  if(showToast) {
    openToast(text);
  }
}
