let currentVideo;
const videos = Array.from(document.getElementsByTagName("video"));
function setCurrentVideo(video) {
  if (
    !currentVideo ||
    !currentVideo.dataset ||
    !currentVideo.dataset.videoId ||
    currentVideo.dataset.videoId !== video.dataset.videoId
  ) {
    currentVideo = video;
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
      return null;
  }
}


