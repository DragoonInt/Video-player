const videoSettings = {
  title: "Демонстрация возможностей видеоплеера",
  duration: 300,
  subtitles: {
    ru: [
      { start: 5, end: 10, text: "Добро пожаловать в демо-режим видеоплеера!" },
      {
        start: 10,
        end: 15,
        text: "Здесь вы можете протестировать все функции плеера",
      },
      {
        start: 15,
        end: 20,
        text: "Включая систему субтитров на разных языках",
      },
      {
        start: 25,
        end: 30,
        text: "Субтитры автоматически синхронизируются с временем видео",
      },
      {
        start: 30,
        end: 35,
        text: "Вы можете выбрать русский или английский язык",
      },
      {
        start: 40,
        end: 45,
        text: "Или полностью отключить отображение субтитров",
      },
      {
        start: 50,
        end: 55,
        text: "Это демонстрация многострочных\nсубтитров в действии",
      },
      { start: 60, end: 65, text: "Субтитры плавно появляются и исчезают" },
      {
        start: 70,
        end: 75,
        text: "В реальном плеере здесь было бы ваше видео",
      },
      {
        start: 80,
        end: 85,
        text: "Спасибо за тестирование функций субтитров!",
      },
    ],
    en: [
      { start: 5, end: 10, text: "Welcome to the video player demo mode!" },
      { start: 10, end: 15, text: "Here you can test all player features" },
      {
        start: 15,
        end: 20,
        text: "Including the subtitle system in different languages",
      },
      {
        start: 25,
        end: 30,
        text: "Subtitles are automatically synchronized with video time",
      },
      {
        start: 30,
        end: 35,
        text: "You can choose Russian or English language",
      },
      { start: 40, end: 45, text: "Or completely disable subtitle display" },
      {
        start: 50,
        end: 55,
        text: "This is a demonstration of multi-line\nsubtitles in action",
      },
      { start: 60, end: 65, text: "Subtitles smoothly appear and disappear" },
      {
        start: 70,
        end: 75,
        text: "In a real player, your video would be here",
      },
      { start: 80, end: 85, text: "Thank you for testing subtitle features!" },
    ],
  },
  availableQualities: ["auto", "2160", "1440", "1080", "720", "480", "360"],
  defaultQuality: "auto",
};

const video = {
  paused: true,
  muted: false,
  volume: 1,
  currentTime: 0,
  duration: videoSettings.duration,
  playbackRate: 1,
  textTracks: [],
  disablePictureInPicture: false,
  quality: videoSettings.defaultQuality,
};

let currentSubtitleLang = "off";
let currentSubtitles = [];

const speedSnapPoints = [0.5, 0.75, 1, 1.25, 1.5, 2];

video.play = function () {
  this.paused = false;
  this._startProgressSimulation();
  updatePlayPauseButton();
};

video.pause = function () {
  this.paused = true;
  if (this._progressInterval) {
    clearInterval(this._progressInterval);
    this._progressInterval = null;
  }
  updatePlayPauseButton();
};

video._startProgressSimulation = function () {
  if (this._progressInterval) return;

  this._progressInterval = setInterval(() => {
    if (!this.paused && this.currentTime < this.duration) {
      this.currentTime += 0.1 * this.playbackRate;
      updateProgress();
      updateSubtitles();
    } else if (this.currentTime >= this.duration) {
      this.pause();
      this.currentTime = 0;
      updateProgress();
      updateSubtitles();
    }
  }, 100);
};

const player = document.getElementById("player");
const playPause = document.getElementById("play-pause");
const progress = document.getElementById("progress");
const progressBar = progress.querySelector(".progress-bar");
const progressHandle = progress.querySelector(".progress-handle");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const muteBtn = document.getElementById("mute");
const volumeOn = muteBtn.querySelector(".volume-on");
const volumeOff = muteBtn.querySelector(".volume-off");
const volumeSlider = document.getElementById("volume");
const fullscreenBtn = document.getElementById("fullscreen");
const expandIcon = fullscreenBtn.querySelector(".expand");
const compressIcon = fullscreenBtn.querySelector(".compress");
const pipBtn = document.getElementById("pip-btn");
const subtitlesDisplay = document.getElementById("subtitles-display");
const videoTitle = document.getElementById("video-title");

const speedBtn = document.getElementById("speed-btn");
const speedMenu = document.getElementById("speed-menu");
const speedSlider = document.getElementById("speed-slider");
const currentSpeedDisplay = document.getElementById("current-speed-display");

const qualityBtn = document.getElementById("quality-btn");
const qualityMenu = document.getElementById("quality-menu");
const currentQualityDisplay = document.getElementById(
  "current-quality-display",
);

const subtitlesBtn = document.getElementById("subtitles-btn");
const subtitlesMenu = document.getElementById("subtitles-menu");
const currentSubtitlesDisplay = document.getElementById(
  "current-subtitles-display",
);

const settingsBtn = document.getElementById("settings-btn");
const settingsMenu = document.getElementById("settings-menu");

function updateSubtitles() {
  if (currentSubtitleLang === "off") {
    subtitlesDisplay.classList.remove("show");
    return;
  }

  const currentTime = video.currentTime;
  const activeSubtitles = currentSubtitles.filter(
    (sub) => currentTime >= sub.start && currentTime <= sub.end,
  );

  if (activeSubtitles.length > 0) {
    const subtitleHTML = activeSubtitles
      .map((sub) => {
        const lines = sub.text.split("\n");
        return lines
          .map((line) => `<div class="subtitle-line">${line}</div>`)
          .join("");
      })
      .join("");

    subtitlesDisplay.innerHTML = subtitleHTML;
    subtitlesDisplay.classList.add("show");
  } else {
    subtitlesDisplay.classList.remove("show");
  }
}

function setSubtitlesLanguage(lang) {
  currentSubtitleLang = lang;

  if (lang === "off") {
    currentSubtitles = [];
    subtitlesDisplay.classList.remove("show");
    currentSubtitlesDisplay.textContent = "Субтитры";
  } else {
    currentSubtitles = videoSettings.subtitles[lang] || [];
    currentSubtitlesDisplay.textContent = lang === "ru" ? "Русский" : "English";
    updateSubtitles();
  }
}

function updateSpeedDisplay(speed) {
  currentSpeedDisplay.textContent = `${speed}x`;
  video.playbackRate = speed;

  document.querySelectorAll(".speed-marker").forEach((marker) => {
    const markerSpeed = parseFloat(marker.dataset.speed);
    if (Math.abs(markerSpeed - speed) < 0.01) {
      marker.classList.add("active");
    } else {
      marker.classList.remove("active");
    }
  });
}

function snapToSpeed(value) {
  let closestSpeed = speedSnapPoints[0];
  let minDiff = Math.abs(value - closestSpeed);

  for (const speed of speedSnapPoints) {
    const diff = Math.abs(value - speed);
    if (diff < minDiff) {
      minDiff = diff;
      closestSpeed = speed;
    }
  }

  return closestSpeed;
}

let activeDropdown = null;

function toggleDropdown(menu, button, container) {
  const isOpening = menu !== activeDropdown;

  closeAllDropdowns();

  if (isOpening) {
    menu.classList.add("open");
    if (container) {
      container.classList.add("active");
    }
    activeDropdown = menu;
  }
}

function closeAllDropdowns() {
  speedMenu.classList.remove("open");
  qualityMenu.classList.remove("open");
  subtitlesMenu.classList.remove("open");
  settingsMenu.classList.remove("open");

  document.querySelectorAll(".control-container").forEach((container) => {
    container.classList.remove("active");
  });

  activeDropdown = null;
}

speedBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown(speedMenu, speedBtn, speedBtn.closest(".control-container"));
});

qualityBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown(
    qualityMenu,
    qualityBtn,
    qualityBtn.closest(".control-container"),
  );
});

subtitlesBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown(
    subtitlesMenu,
    subtitlesBtn,
    subtitlesBtn.closest(".control-container"),
  );
});

settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown(
    settingsMenu,
    settingsBtn,
    settingsBtn.closest(".control-container"),
  );
});

document.addEventListener("click", () => {
  closeAllDropdowns();
});

document.querySelectorAll(".dropdown-menu").forEach((menu) => {
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

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

const togglePlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const updatePlayPauseButton = () => {
  if (video.paused) {
    playPause.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  } else {
    playPause.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  }
};

const updateProgress = () => {
  if (isNaN(video.duration)) return;
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${percent}%`;
  progressHandle.style.left = `${percent}%`;
  currentTimeEl.textContent = formatTime(video.currentTime);
  durationEl.textContent = formatTime(video.duration);
};

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
  updateProgress();
  updateSubtitles();
}

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

speedSlider.addEventListener("input", (e) => {
  const speed = parseFloat(e.target.value);
  updateSpeedDisplay(speed);
});

speedSlider.addEventListener("change", (e) => {
  const speed = parseFloat(e.target.value);
  const snappedSpeed = snapToSpeed(speed);
  speedSlider.value = snappedSpeed;
  updateSpeedDisplay(snappedSpeed);
});

document.querySelectorAll(".speed-marker").forEach((marker) => {
  marker.addEventListener("click", () => {
    const speed = parseFloat(marker.dataset.speed);
    speedSlider.value = speed;
    updateSpeedDisplay(speed);
  });
});

document.querySelectorAll("#quality-menu .option").forEach((opt) => {
  opt.addEventListener("click", () => {
    document
      .querySelectorAll("#quality-menu .option")
      .forEach((o) => o.classList.remove("active"));
    opt.classList.add("active");
    video.quality = opt.dataset.quality;

    const qualityText = opt.querySelector(".option-main").textContent;
    currentQualityDisplay.textContent = qualityText;

    closeAllDropdowns();
  });
});

document.querySelectorAll("#subtitles-menu .option").forEach((opt) => {
  opt.addEventListener("click", () => {
    document
      .querySelectorAll("#subtitles-menu .option")
      .forEach((o) => o.classList.remove("active"));
    opt.classList.add("active");
    const lang = opt.dataset.lang;

    setSubtitlesLanguage(lang);

    closeAllDropdowns();
  });
});

pipBtn.addEventListener("click", async () => {
  alert("Picture-in-Picture недоступно для демо-режима");
  closeAllDropdowns();
});

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

function loadVideoSettings(settings) {
  if (settings.title) {
    videoTitle.textContent = settings.title;
  }

  if (settings.duration) {
    video.duration = settings.duration;
    durationEl.textContent = formatTime(settings.duration);
  }

  if (settings.defaultQuality) {
    video.quality = settings.defaultQuality;
    const qualityOption = document.querySelector(
      `[data-quality="${settings.defaultQuality}"]`,
    );
    if (qualityOption) {
      qualityOption.click();
    }
  }
}

const initializePlayer = () => {
  loadVideoSettings(videoSettings);

  updateVolumeIcons();
  updatePlayPauseButton();
  updateProgress();
  setSubtitlesLanguage("off");
  updateSpeedDisplay(1);
};

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

player.addEventListener("click", (e) => {
  if (
    !e.target.closest(".controls") &&
    !e.target.closest(".subtitles-display")
  ) {
    togglePlay();
  }
});

playPause.addEventListener("click", togglePlay);

initializePlayer();
