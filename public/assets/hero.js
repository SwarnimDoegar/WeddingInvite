const heroVideo = document.getElementById("heroVideo");
const soundToggle = document.getElementById("soundToggle");
const playToggle = document.getElementById("playToggle");

// `hidden` is an HTMLElement IDL property — it doesn't exist on SVGElement,
// so `svgIcon.hidden = true` silently sets a meaningless expando property
// instead of the real `hidden` attribute the [hidden] CSS rule matches on.
// Toggling the attribute directly works correctly on any element type.
function setIconHidden(el, isHidden) {
  if (isHidden) {
    el.setAttribute("hidden", "");
  } else {
    el.removeAttribute("hidden");
  }
}

function updateSoundIcon() {
  if (!soundToggle) return;
  setIconHidden(soundToggle.querySelector(".icon-unmuted"), heroVideo.muted);
  setIconHidden(soundToggle.querySelector(".icon-muted"), !heroVideo.muted);
  soundToggle.setAttribute(
    "aria-label",
    heroVideo.muted ? "Unmute video" : "Mute video"
  );
}

function updatePlayIcon() {
  if (!playToggle) return;
  setIconHidden(playToggle.querySelector(".icon-pause"), heroVideo.paused);
  setIconHidden(playToggle.querySelector(".icon-play"), !heroVideo.paused);
  playToggle.setAttribute(
    "aria-label",
    heroVideo.paused ? "Play video" : "Pause video"
  );
}

// Browsers block autoplay-with-sound unless the visitor already interacted
// with the page. Try unmuted first; fall back to muted autoplay if blocked.
heroVideo.muted = false;
heroVideo
  .play()
  .catch(() => {
    heroVideo.muted = true;
    return heroVideo.play();
  })
  .catch(() => {})
  .finally(updateSoundIcon);

updatePlayIcon();

// The 'play'/'pause' events are the source of truth for the icon — they
// fire whenever playback state actually changes, including delayed cases
// like a video that hasn't buffered enough data yet for `paused` to flip
// synchronously on a play() call. The click handlers below also call
// updatePlayIcon() directly for instant feedback on the common fast path;
// these listeners are what keep the icon correct when that's not enough.
heroVideo.addEventListener("play", updatePlayIcon);
heroVideo.addEventListener("pause", updatePlayIcon);

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    if (!heroVideo.muted) heroVideo.play();
    updateSoundIcon();
  });
}

if (playToggle) {
  playToggle.addEventListener("click", () => {
    if (heroVideo.paused) {
      heroVideo.play();
    } else {
      heroVideo.pause();
    }
    updatePlayIcon();
  });
}
