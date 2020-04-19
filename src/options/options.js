function restore_options() {
  chrome.storage.sync.get(["playBackRate", "skipDuration"], function (result) {
    document.getElementById("speed-selection-input").value =
      result.playBackRate || 10;
    document.getElementById("skip-rate-input").value =
      result.skipDuration || 10;
  });
}

function save_options() {
  const playBackRate = document.getElementById("speed-selection-input").value;
  const skipDuration = document.getElementById("skip-rate-input").value;

  chrome.storage.sync.set(
    {
      playBackRate,
      skipDuration,
    },
    function () {
      alert("Settings saved");
    }
  );
}

document.addEventListener("DOMContentLoaded", restore_options);
document
  .getElementById("save-playback-options")
  .addEventListener("click", save_options);
