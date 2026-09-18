// The form POSTs directly to the Google Form's response endpoint, targeted
// at a hidden iframe so the page never navigates away. Google's response
// happens cross-origin, so we can't read it — the iframe's `load` event is
// just used as a "the submission round-trip finished" signal to reveal the
// success message. The `hasSubmitted` guard exists because that same load
// event also fires once on initial page load for the empty iframe.
const rsvpForm = document.getElementById("rsvpForm");
const rsvpSuccess = document.getElementById("rsvpSuccess");
const hiddenRsvpFrame = document.getElementById("hiddenRsvpFrame");
let hasSubmitted = false;

if (rsvpForm) {
  rsvpForm.addEventListener("submit", () => {
    hasSubmitted = true;
  });
}

if (hiddenRsvpFrame) {
  hiddenRsvpFrame.addEventListener("load", () => {
    if (!hasSubmitted) return;
    // .hidden has no effect here: .rsvp-form sets `display: flex` in CSS,
    // and author styles always override the UA's [hidden] rule regardless
    // of specificity — so the display is set directly instead.
    rsvpForm.style.display = "none";
    rsvpSuccess.style.display = "block";
  });
}
