const video = document.getElementById("video");
const player = document.getElementById("player");
const playPause = document.getElementById("play-pause");
const progress = document.getElementById("progress");
const progressBar = progress.querySelector(".progress-bar");
const progressHandle = progress.querySelector(".progress-handle");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const muteBtn = document.querySelector(".volume-btn");
const volumeOn = muteBtn.querySelector(".volume-on");
const volumeOff = muteBtn.querySelector(".volume-off");
const volumeSlider = document.getElementById("volume");
const settingsBtn = document.getElementById("settings-btn");
const settingsMenu = document.getElementById("settings-menu");
const fullscreenBtn = document.getElementById("fullscreen");
const expandIcon = fullscreenBtn.querySelector(".expand");
const compressIcon = fullscreenBtn.querySelector(".compress");
const pipBtn = document.getElementById("pip-btn");

// === ФОРМАТ ВРЕМЕНИ ===
const formatTime = (sec) => {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

// === PLAY/PAUSE ===
const togglePlay = () => {
  if (video.paused) {
    video.play();
    playPause.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  } else {
    video.pause();
    playPause.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  }
};

// === ПРОГРЕСС ===
const updateProgress = () => {
  if (isNaN(video.duration)) return;
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${percent}%`;
  progressHandle.style.left = `${percent}%`;
  currentTimeEl.textContent = formatTime(video.currentTime);
  durationEl.textContent = formatTime(video.duration);
};

// === ПЕРЕМОТКА ===
let isScrubbing = false;
progress.addEventListener("mousedown", (e) => {
  isScrubbing = true;
  scrub(e);
});
document.addEventListener("mousemove", (e) => isScrubbing && scrub(e));
document.addEventListener("mouseup", () => (isScrubbing = false));

function scrub(e) {
  const rect = progress.getBoundingClientRect();
  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  video.currentTime = pos * video.duration;
}

// === ГРОМКОСТЬ ===
muteBtn.addEventListener("click", () => {
  video.muted = !video.muted;
  updateVolumeIcons();
  volumeSlider.value = video.muted ? 0 : video.volume;
});

volumeSlider.addEventListener("input", () => {
  video.volume = volumeSlider.value;
  video.muted = volumeSlider.value == 0;
  updateVolumeIcons();
});

// Колесо мыши
muteBtn.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.05 : 0.05;
  const newVol = Math.max(0, Math.min(1, video.volume + delta));
  video.volume = newVol;
  volumeSlider.value = newVol;
  video.muted = newVol === 0;
  updateVolumeIcons();
});

function updateVolumeIcons() {
  const isMuted = video.muted || video.volume == 0;
  volumeOn.style.display = isMuted ? "none" : "block";
  volumeOff.style.display = isMuted ? "block" : "none";
  muteBtn.classList.toggle("muted", isMuted);
}

// === СКОРОСТЬ ===
document.querySelectorAll("#speed-options .option").forEach((opt) => {
  opt.addEventListener("click", () => {
    document
      .querySelector("#speed-options .active")
      ?.classList.remove("active");
    opt.classList.add("active");
    video.playbackRate = parseFloat(opt.dataset.speed);
  });
});

// === СУБТИТРЫ ===
document.querySelectorAll("#subtitle-options .option").forEach((opt) => {
  opt.addEventListener("click", () => {
    document
      .querySelector("#subtitle-options .active")
      ?.classList.remove("active");
    opt.classList.add("active");

    const lang = opt.dataset.lang;
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode =
        lang === "off"
          ? "hidden"
          : tracks[i].language === lang
            ? "showing"
            : "hidden";
    }
  });
});

// === PiP ===
pipBtn.addEventListener("click", async () => {
  if (!document.pictureInPictureEnabled || video.disablePictureInPicture)
    return;
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  } catch (err) {
    console.warn("PiP error:", err);
  }
});

// === НАСТРОЙКИ (открытие/закрытие) ===
let settingsOpen = false;
settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  settingsOpen = !settingsOpen;
  settingsMenu.classList.toggle("open", settingsOpen);
});

document.addEventListener("click", (e) => {
  if (
    settingsOpen &&
    !settingsBtn.contains(e.target) &&
    !settingsMenu.contains(e.target)
  ) {
    settingsOpen = false;
    settingsMenu.classList.remove("open");
  }
});

// === FULLSCREEN ===
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    player.classList.add("fs-transition");
    player.requestFullscreen().then(() => {
      expandIcon.style.display = "none";
      compressIcon.style.display = "block";
    });
  } else {
    player.classList.add("fs-transition");
    document.exitFullscreen().then(() => {
      expandIcon.style.display = "block";
      compressIcon.style.display = "none";
    });
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    setTimeout(() => player.classList.remove("fs-transition"), 500);
  }
});

// === ИНИЦИАЛИЗАЦИЯ ===
video.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(video.duration);
  updateVolumeIcons();
});

video.addEventListener("timeupdate", updateProgress);
video.addEventListener("canplay", updateProgress);
video.addEventListener("click", togglePlay);
playPause.addEventListener("click", togglePlay);

// === АВТО-СКРЫТИЕ ===
let hideTimer;
const showControls = () => {
  player.querySelector(".controls").style.opacity = "1";
  clearTimeout(hideTimer);
  if (!video.paused) {
    hideTimer = setTimeout(() => {
      player.querySelector(".controls").style.opacity = "0";
    }, 2500);
  }
};
player.addEventListener("mousemove", showControls);
video.addEventListener("play", showControls);

// === ОШИБКА ЗАГРУЗКИ ===
video.addEventListener("error", () => {
  durationEl.textContent = "Ошибка";
});
