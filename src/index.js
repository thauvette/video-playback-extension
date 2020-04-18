let currentVideo, timeout;
const timerDefaultLength = 1000;
const videoPlayBackToastId = 'video-playback-toast'
const styles = "#video-playback-toast {display: none;}" + 
"#video-playback-toast.active {" +
  "display: block;" +
  "position: absolute;" +
  "top: 0;" +
  "left: 0;" +
  "border: 1px solid #000;" +
  "border-radius: 4px;" +
  "padding: 8px 16px;" +
  "font-size: 12px;" +
  "color: #000;" +
  "background-color: rgba(255,255,255, 0.5);" +
  "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue';" +
"}"

const videos = Array.from(document.getElementsByTagName("video"));
function setCurrentVideo(video) {
  if (
    !currentVideo ||
    !currentVideo.dataset ||
    !currentVideo.dataset.videoId ||
    currentVideo.dataset.videoId !== video.dataset.videoId
  ) {
    // remove any old toasts
    // should only be one but just in case
    const oldToasts = document.getElementsByClassName('video-play-back-toast')
    for(const toast of oldToasts) {
      toast.remove()
    }

    currentVideo = video;
    const videoPBToast = document.createElement("div");
    videoPBToast.setAttribute('id', videoPlayBackToastId);
    videoPBToast.setAttribute('class', 'video-play-back-toast')
    currentVideo.parentElement.appendChild(videoPBToast)
  }
}
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
  const head = document.getElementsByTagName('HEAD')[0];  
  const stylesheet = document.createElement('style')
  stylesheet.innerHTML = styles
  head.appendChild(stylesheet); 
}


function closeToast(toast) {
  toast.classList.remove('active')
}

function openToast() {
  const playBackRate = currentVideo.playbackRate
  const toast = document.getElementById(videoPlayBackToastId)
  const toastIsShowing = toast.classList.contains('active');
  if(toastIsShowing) {
    clearTimeout(timeout)
  } else {
    toast.classList.add('active')
  }
  toast.innerHTML = `${Number(playBackRate * 100).toFixed(0)}%`
  timeout = setTimeout(() => closeToast(toast), timerDefaultLength)
} 

function handleKeyDown(e) {
  if (!currentVideo) return null;
  switch (e.code) {
    case "KeyD":
      currentVideo.playbackRate = currentVideo.playbackRate + 0.1;
      break;
    case "KeyS":
      currentVideo.playbackRate = currentVideo.playbackRate - 0.1;
      break;
    case "KeyR":
      currentVideo.playbackRate = 1;
      break;
    case "KeyX":
      currentVideo.currentTime = currentVideo.currentTime + 10;
      break;
    case "KeyZ":
      currentVideo.currentTime = currentVideo.currentTime - 10;
      break;
    default:
      break;
  }
  openToast()
}