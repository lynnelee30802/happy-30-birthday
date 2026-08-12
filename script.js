/* =========================================================
   HAPPY 30 — SHARED JAVASCRIPT
   Keep interactions lightweight and progressive.
   ========================================================= */

const beginButton = document.querySelector('#beginButton');
const openingPage = document.querySelector('#opening');
const loadingPage = document.querySelector('#loading-memories');
const storyPage = document.querySelector('#our-story');

const loadingStatus = document.querySelector('#loadingStatus');
const loadingPercent = document.querySelector('#loadingPercent');
const loadingBar = document.querySelector('#loadingBar');
const loadingTrack = document.querySelector('#loadingTrack');
const loadingShell = document.querySelector('.loading-shell');
const loadingComplete = document.querySelector('#loadingComplete');

const loadingSteps = [
  { until: 25, text: 'Loading memories...' },
  { until: 50, text: 'Analyzing questionable decisions...' },
  { until: 75, text: 'Finding our best photos...' },
  { until: 100, text: 'Preparing Chapter 30...' },
];

let loadingStarted = false;
let currentStatusText = '';

function setLoadingStatus(text) {
  if (!loadingStatus || currentStatusText === text) return;

  currentStatusText = text;
  loadingStatus.classList.add('is-changing');

  window.setTimeout(() => {
    loadingStatus.textContent = text;
    loadingStatus.classList.remove('is-changing');
  }, 110);
}

function runLoadingSequence() {
  if (loadingStarted || !loadingPage) return;
  loadingStarted = true;

  loadingPage.classList.add('is-active');

  const duration = 3600;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const rawProgress = Math.min(elapsed / duration, 1);

    // Smoothstep keeps the percentage moving continuously without looking mechanical.
    const easedProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);
    const percent = Math.min(100, Math.round(easedProgress * 100));

    if (loadingPercent) loadingPercent.textContent = `${percent}%`;
    if (loadingBar) loadingBar.style.width = `${percent}%`;
    if (loadingTrack) loadingTrack.setAttribute('aria-valuenow', String(percent));

    const activeStep = loadingSteps.find((step) => percent <= step.until) || loadingSteps[loadingSteps.length - 1];
    setLoadingStatus(activeStep.text);

    if (rawProgress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    if (loadingPercent) loadingPercent.textContent = '100%';
    if (loadingBar) loadingBar.style.width = '100%';
    if (loadingTrack) loadingTrack.setAttribute('aria-valuenow', '100');

    window.setTimeout(() => {
      if (loadingShell) loadingShell.classList.add('is-complete');
      if (loadingComplete) loadingComplete.setAttribute('aria-hidden', 'false');

      // Page 3 is still a placeholder. Once it has content, this becomes the automatic handoff.
      window.setTimeout(() => {
        if (storyPage && storyPage.offsetHeight > 0) {
          storyPage.scrollIntoView({ behavior: 'smooth' });
        }
      }, 850);
    }, 180);
  }

  window.requestAnimationFrame(tick);
}

if (beginButton && openingPage && loadingPage) {
  beginButton.addEventListener('click', () => {
    if (openingPage.classList.contains('is-leaving')) return;

    openingPage.classList.add('is-leaving');
    beginButton.setAttribute('disabled', '');

    window.setTimeout(() => {
      loadingPage.scrollIntoView({ behavior: 'smooth' });

      window.setTimeout(() => {
        runLoadingSequence();
        openingPage.classList.remove('is-leaving');
        beginButton.removeAttribute('disabled');
      }, 360);
    }, 520);
  });
}
