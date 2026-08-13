const beginButton = document.querySelector('#beginButton');
const openingPage = document.querySelector('#opening');
const loadingPage = document.querySelector('#loading-memories');
const loadingMessage = document.querySelector('#loadingMessage');
const loadingFill = document.querySelector('#loadingFill');
const loadingTrack = document.querySelector('#loadingTrack');
const storyPage = document.querySelector('#our-story');

let loadingStarted = false;

const loadingSequence = [
  { at: 0, text: 'Loading memories...', progress: 30 },
  { at: 1250, text: 'Finding our best photos...', progress: 65 },
  { at: 2600, text: 'Preparing Chapter 30...', progress: 92 },
  { at: 3950, text: 'Done.', progress: 100 },
  { at: 4450, text: 'Your story is ready.', ready: true },
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

function setProgress(value) {
  if (loadingFill) loadingFill.style.width = `${value}%`;
  if (loadingTrack) loadingTrack.setAttribute('aria-valuenow', String(value));
}

function runLoadingSequence() {
  if (loadingStarted || !loadingPage) return;
  loadingStarted = true;
  loadingPage.classList.add('is-active');
  setProgress(0);

  loadingSequence.forEach((step, index) => {
    window.setTimeout(() => {
      changeLoadingMessage(step.text, index === 0);
      if (typeof step.progress === 'number') setProgress(step.progress);
      if (step.ready) loadingPage.classList.add('is-ready');
    }, step.at);
  });

  window.setTimeout(() => {
    if (storyPage && storyPage.offsetHeight > 0) {
      storyPage.scrollIntoView({ behavior: 'smooth' });
    }
  }, 5350);
}

if (beginButton && openingPage && loadingPage) {
  beginButton.addEventListener('click', () => {
    if (openingPage.classList.contains('is-leaving')) return;
    openingPage.classList.add('is-leaving');
    beginButton.setAttribute('disabled', '');

    window.setTimeout(() => {
      openingPage.hidden = true;
      openingPage.style.display = 'none';
      loadingPage.hidden = false;
      loadingPage.style.display = 'grid';

      window.requestAnimationFrame(() => {
        loadingPage.scrollIntoView({ behavior: 'auto', block: 'start' });
        runLoadingSequence();
      });
    }, 420);
  });
}
