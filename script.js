/* =========================================================
   HAPPY 30 — SHARED JAVASCRIPT
   Keep interactions lightweight and progressive.
   ========================================================= */

const beginButton = document.querySelector('#beginButton');
const openingPage = document.querySelector('#opening');
const loadingPage = document.querySelector('#loading-memories');
const loadingMessage = document.querySelector('#loadingMessage');
const loadingFill = document.querySelector('#loadingFill');
const loadingTrack = document.querySelector('#loadingTrack');
const storyPage = document.querySelector('#our-story');

let loadingStarted = false;

const loadingSequence = [
  { at: 0, text: 'Loading memories...' },
  { at: 1050, text: 'Finding our best photos...' },
  { at: 2150, text: 'Preparing Chapter 30...' },
  { at: 3100, text: 'Done.' },
  { at: 3550, text: 'Your story is ready.' },
];

function changeLoadingMessage(text, isFirst = false) {
  if (!loadingMessage) return;

  if (isFirst) {
    loadingMessage.textContent = text;
    return;
  }

  loadingMessage.classList.add('is-switching');

  window.setTimeout(() => {
    loadingMessage.textContent = text;
    loadingMessage.classList.remove('is-switching');
  }, 260);
}

function runLoadingSequence() {
  if (loadingStarted || !loadingPage) return;
  loadingStarted = true;

  loadingPage.classList.add('is-active');

  const progressDuration = 3100;
  const start = performance.now();

  function animateProgress(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / progressDuration, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    const percent = eased * 100;

    if (loadingFill) loadingFill.style.width = `${percent}%`;
    if (loadingTrack) loadingTrack.setAttribute('aria-valuenow', String(Math.round(percent)));

    if (progress < 1) {
      window.requestAnimationFrame(animateProgress);
    }
  }

  window.requestAnimationFrame(animateProgress);

  loadingSequence.forEach((step, index) => {
    window.setTimeout(() => {
      changeLoadingMessage(step.text, index === 0);

      if (step.text === 'Done.') {
        if (loadingFill) loadingFill.style.width = '100%';
        if (loadingTrack) loadingTrack.setAttribute('aria-valuenow', '100');
      }

      if (step.text === 'Your story is ready.') {
        loadingPage.classList.add('is-ready');
      }
    }, step.at);
  });

  // Page 3 is still a placeholder. Once Page 3 is built, this becomes the automatic handoff.
  window.setTimeout(() => {
    if (storyPage && storyPage.offsetHeight > 0) {
      storyPage.scrollIntoView({ behavior: 'smooth' });
    }
  }, 4550);
}

if (beginButton && openingPage && loadingPage) {
  beginButton.addEventListener('click', () => {
    if (openingPage.classList.contains('is-leaving')) return;

    openingPage.classList.add('is-leaving');
    beginButton.setAttribute('disabled', '');

    window.setTimeout(() => {
      loadingPage.hidden = false;
      openingPage.hidden = true;

      // Page 2 becomes the only visible page, so Page 1 can never peek above it.
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      window.requestAnimationFrame(() => {
        runLoadingSequence();
      });
    }, 520);
  });
}
