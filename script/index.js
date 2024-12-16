const player = document.querySelector('.time__end');
const play = document.querySelector('.play');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const timeline = document.querySelector('.linetime__input');
const volumeSlider = document.querySelector('.volume-slider');
const volume = document.querySelector('.volume');

let isPlaying = false;
let currentTrackIndex = 0;

const tracks = [
  {
    src: './assets/audio/Nirvana — Polly.mp3',
    artist: 'Nirvana',
    title: 'Polly',
    img: './assets/img/kurtjpg.jpg',
  },
  {
    src: "./assets/audio/Marvin Gaye - Let's Get It On.mp3",
    artist: 'Marvin Gaye',
    title: "Let's Get It On",
    img: './assets/img/mavin.jpg',
  },
  {
    src: './assets/audio/dontstartnow.mp3',
    artist: 'Dua Lipa',
    title: "Don't Start Now",
    img: './assets/img/dontstartnow.png',
  },
];

const audio = new Audio();

const isIOS =
  /iPad|iPhone|iPod/.test(navigator.platform) ||
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

if (isIOS) {
  volume.style.display = 'none';
}

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  document.querySelector('.artist').textContent = track.artist;
  document.querySelector('.title').textContent = track.title;
  document.querySelector('.player__img').style.backgroundImage = `url(${track.img})`;
  document.querySelector('.bg__blur').style.backgroundImage = `url(${track.img})`;
}

loadTrack(currentTrackIndex);

audio.addEventListener('loadeddata', () => {
  player.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  const progressBar = document.querySelector('.progress');
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
  document.querySelector('.time__start').textContent = formatTime(audio.currentTime);
  if (audio.ended) {
    nextTrack();
  }
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function playPause() {
  const playImage = play.querySelector('img');
  if (isPlaying) {
    audio.pause();
    playImage.src = './assets/img/controls/play.png';
    document.querySelector('.player__img').classList.remove('animation');
  } else {
    audio.play();
    playImage.src = './assets/img/controls/pause.png';
    document.querySelector('.player__img').classList.add('animation');
  }
  isPlaying = !isPlaying;
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  audio.currentTime = 0;
  if (isPlaying) audio.play();
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  audio.currentTime = 0;
  if (isPlaying) audio.play();
}

function handleTimelineClick(e) {
  const timelineWidth = parseInt(window.getComputedStyle(timeline).width);
  const clickPosition = e.offsetX / timelineWidth;
  audio.currentTime = clickPosition * audio.duration;
}

function handleVolumeMouseMove(e) {
  const sliderHeight = parseInt(window.getComputedStyle(volumeSlider).height);
  const sliderRect = volumeSlider.getBoundingClientRect();

  const offsetY = Math.min(Math.max(e.clientY - sliderRect.top, 0), sliderHeight);

  const newVolume = 1 - offsetY / sliderHeight;

  audio.volume = Math.min(Math.max(newVolume, 0), 1);
  document.querySelector('.volume-percentage').style.height = `${audio.volume * 100}%`;
}

play.addEventListener('click', playPause);
prev.addEventListener('click', prevTrack);
next.addEventListener('click', nextTrack);
timeline.addEventListener('click', handleTimelineClick);
let isChanged = false;

volumeSlider.addEventListener('mousedown', (e) => {
  if (
    e.target.classList.contains('active__volume') ||
    e.target.classList.contains('volume-percentage')
  ) {
    e.preventDefault();
    handleVolumeMouseMove(e);
    isChanged = true;
    document.addEventListener('mousemove', handleVolumeMouseMove);
  }
});
document.addEventListener('mouseup', (e) => {
  if (isChanged) {
    document.removeEventListener('mousemove', handleVolumeMouseMove);
    volumeSlider.classList.remove('active__volume');
    isChanged = false;
  }
});

function handleVolumeTouchMove(e) {
  const sliderHeight = parseInt(window.getComputedStyle(volumeSlider).height);
  const sliderRect = volumeSlider.getBoundingClientRect();

  const touchY = e.touches[0].clientY;
  const offsetY = Math.min(Math.max(touchY - sliderRect.top, 0), sliderHeight);
  const newVolume = 1 - offsetY / sliderHeight;

  audio.volume = Math.min(Math.max(newVolume, 0), 1);
  document.querySelector('.volume-percentage').style.height = `${audio.volume * 100}%`;
}

volumeSlider.addEventListener('touchstart', (e) => {
  if (
    e.target.classList.contains('active__volume') ||
    e.target.classList.contains('volume-percentage')
  ) {
    e.preventDefault();
    handleVolumeTouchMove(e);
    isChanged = true;
    volumeSlider.addEventListener('touchmove', handleVolumeTouchMove);
  }
});

document.addEventListener('touchend', () => {
  if (isChanged) {
    volumeSlider.removeEventListener('touchmove', handleVolumeTouchMove);
    volumeSlider.classList.remove('active__volume');
    isChanged = false;
  }
});

volume.addEventListener('click', () => {
  const slider = document.querySelector('.volume-slider');
  if (slider.classList.contains('active__volume')) {
    slider.classList.remove('active__volume');
  } else {
    slider.classList.add('active__volume');
  }
});
