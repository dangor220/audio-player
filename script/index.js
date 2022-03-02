const player = document.querySelector(".time__end");
const play = document.querySelector(".play");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const timeline = document.querySelector(".linetime__input");

let isPlay = false;
let playNum = 0;

const arrMusic = [
  [
    "./assets/audio/Nirvana — Polly.mp3",
    "Nirvana",
    "Polly",
    "./assets/img/kurtjpg.jpg",
  ],
  [
    "./assets/audio/Marvin Gaye - Let's Get It On.mp3",
    "Marvin Gaye",
    "Let's Get It On",
    "./assets/img/mavin.jpg",
  ],
  [
    "./assets/audio/dontstartnow.mp3",
    "Dua Lipa",
    "Don't Start Now",
    "./assets/img/dontstartnow.png",
  ]
];

const audio = new Audio("./assets/audio/beyonce.mp3");

audio.addEventListener(
  "loadeddata",
  () => {
    player.textContent = getTimeCodeFromNum(audio.duration);
  },
  false
);
// let timeToSeek;

timeline.addEventListener(
  "click",
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false
);

setTimeout(
  "document.querySelector('.wrapper__image').classList.remove('animation')",
  100
);

function setTitle() {
  document.querySelector(".artist").textContent = arrMusic[playNum][1];
  document.querySelector(".title").textContent = arrMusic[playNum][2];

  document.querySelector(
    ".wrapper__image"
  ).style.backgroundImage = `url(${arrMusic[playNum][3]})`;
  document.querySelector(".wrapper__image").classList.add("animation");

  document.querySelector(
    ".main"
  ).style.backgroundImage = `url(${arrMusic[playNum][3]})`;
}
setTitle();

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

play.addEventListener("click", start);
prev.addEventListener("click", prevSound);
next.addEventListener("click", nextSound);

function start(e, num = playNum, time = audio.currentTime) {
  play.classList.add("anim");
  document.querySelector(".wrapper__image").classList.add("animation");

  setTimeout("play.classList.remove('anim')", 300);

  if (!isPlay) {
    play.classList.add("pause");
    isPlay = true;

    playSounds(isPlay, num, time);
  } else {
    play.classList.remove("pause");
    isPlay = false;

    setTimeout(
      "document.querySelector('.wrapper__image').classList.remove('animation')",
      100
    );

    playSounds(isPlay);
  }
}

setInterval(() => {
  const progressBar = document.querySelector(".progress");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  document.querySelector(".time__start").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
  endSound();
}, 500);

function prevSound() {
  prev.classList.add("anim");
  setTimeout("prev.classList.remove('anim')", 300);
  play.classList.add("pause");

  isPlay = true;
  timeToSeek = 0;

  playNum -= 1;
  if (playNum < 0) {
    playNum = arrMusic.length - 1;
  }
  setTitle();
  playSounds(isPlay, playNum, 0);
}

function nextSound() {
  next.classList.add("anim");
  setTimeout("next.classList.remove('anim')", 300);
  play.classList.add("pause");

  isPlay = true;
  timeToSeek = 0;
  playNum += 1;
  if (playNum > arrMusic.length - 1) {
    playNum = 0;
  }
  setTitle();
  playSounds(isPlay, playNum, 0);
}

function playSounds(flag, num, time) {
  if (flag) {
    audio.src = `${arrMusic[num][0]}`;
    audio.currentTime = time;
    // if (timeToSeek) {
    //   audio.currentTime = timeToSeek;
    // }
    audio.play();
  } else {
    audio.pause();
  }
}

function endSound() {
  if (audio.duration === audio.currentTime) {
    nextSound();
  }
}

const volumeSlider = document.querySelector(".volume-slider");

volumeSlider.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("active__volume") ||
    e.target.classList.contains("volume-percentage")
  ) {
    const sliderWidth = window.getComputedStyle(volumeSlider).height;
    const newVolume = e.offsetY / parseInt(sliderWidth);
    audio.volume = newVolume;
    document.querySelector(".volume-percentage").style.height =
      newVolume * 100 + "%";
  }
});

const wrapp = document.querySelector(".wrapper__controls");

wrapp.addEventListener("mouseover", (e) => {
  if (
    !(
      e.target.classList.contains("active__volume") ||
      e.target.classList.contains("volume-percentage")
    )
  ) {
    volumeSlider.classList.remove("active__volume");
  }
});

const volume = document.querySelector(".volume");

volume.addEventListener("click", (e) => {
  volumeSlider.classList.toggle("active__volume");
});
