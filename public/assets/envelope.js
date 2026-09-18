const envelopeGate = document.getElementById("envelopeGate");
const envelopeTrigger = document.getElementById("envelopeTrigger");
const envelopeFlapWrap = document.querySelector(".envelope__flap-wrap");
const pageContent = document.querySelector(".page");

if (envelopeTrigger && envelopeGate && envelopeFlapWrap) {
  envelopeTrigger.addEventListener(
    "click",
    () => {
      // Starts the flap's own hinge-open animation. The gate itself
      // doesn't fade yet — see the flap's transitionend handler below.
      envelopeGate.classList.add("is-open");
      document.documentElement.classList.remove("envelope-active");
      document.body.classList.remove("envelope-active");
      // Started from a real click, which is what lets the video play
      // unmuted at all — browsers block unmuted autoplay without a trusted
      // user gesture. The short delay stays well inside the browser's
      // user-activation window, so sound is still allowed.
      setTimeout(() => {
        document.dispatchEvent(new Event("inviteOpened"));
      }, 700);
    },
    { once: true }
  );

  envelopeFlapWrap.addEventListener("transitionend", (e) => {
    // transitionend bubbles, and the seal (a descendant) has its own
    // transform transition for the hover effect — without this target
    // check, merely hovering the envelope would dismiss the gate. Note
    // this also can't use { once: true }: that removes the listener as
    // soon as it's invoked, even for a bubbled event we ignore here.
    if (e.target !== envelopeFlapWrap || e.propertyName !== "transform") return;
    if (!envelopeGate.classList.contains("is-open")) return;
    // Only once the flap has fully opened does the gate start fading.
    envelopeGate.classList.add("is-dismissing");
  });

  envelopeGate.addEventListener("transitionend", (e) => {
    if (e.target !== envelopeGate || !envelopeGate.classList.contains("is-dismissing")) {
      return;
    }
    // The gate is now fully faded and out of the way — only now does the
    // content start fading in, so the two animations never overlap.
    envelopeGate.style.display = "none";
    if (pageContent) pageContent.classList.add("is-visible");
  });
}
