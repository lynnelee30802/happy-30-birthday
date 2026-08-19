if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

const beginButton = document.querySelector('#beginButton');
const openingPage = document.querySelector('#opening');
const loadingPage = document.querySelector('#loading-memories');
const loadingMessage = document.querySelector('#loadingMessage');
const loadingFill = document.querySelector('#loadingFill');
const loadingTrack = document.querySelector('#loadingTrack');
const storyPage = document.querySelector('#our-story');

let loadingStarted = false;

const loadingSequence = [
  { at: 0, text: 'Loading memories...', progress: 25 },
  { at: 1250, text: 'Finding our best photos...', progress: 50 },
  { at: 2500, text: 'Preparing Chapter 30...', progress: 75 },
  { at: 3750, text: 'Done.', progress: 100 },
  { at: 4910, text: 'Your story is ready.', ready: true, final: true },
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

function changeToFinalMessage(text) {
  if (!loadingMessage) return;

  loadingMessage.classList.remove('is-switching');
  loadingMessage.style.transition = 'opacity 320ms ease, transform 320ms ease';
  loadingMessage.style.opacity = '0';
  loadingMessage.style.transform = 'translateY(3px)';

  window.setTimeout(() => {
    loadingMessage.textContent = text;
    loadingPage.classList.add('is-ready');

    window.requestAnimationFrame(() => {
      loadingMessage.style.opacity = '1';
      loadingMessage.style.transform = 'translateY(0)';
    });
  }, 320);

  window.setTimeout(() => {
    loadingMessage.style.removeProperty('transition');
    loadingMessage.style.removeProperty('opacity');
    loadingMessage.style.removeProperty('transform');
  }, 760);
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
      if (step.final) {
        changeToFinalMessage(step.text);
        return;
      }

      changeLoadingMessage(step.text, index === 0);

      if (typeof step.progress === 'number') {
        setProgress(step.progress);
      }
    }, step.at);
  });

  window.setTimeout(() => {
    if (storyPage && storyPage.offsetHeight > 0) {
      storyPage.scrollIntoView({ behavior: 'smooth' });
    }
  }, 6200);
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

/* Page 3 — click-through story chapters. */
const storyCard = document.querySelector('#storyCard');
const chapterLabel = document.querySelector('#chapterLabel');
const chapterTitle = document.querySelector('#chapterTitle');
const chapterBody = document.querySelector('#chapterBody');
const chapterImage = document.querySelector('#chapterImage');
const storyProgress = document.querySelector('#storyProgress');
const storyNextButton = document.querySelector('#storyNextButton');
const storyNextLabel = document.querySelector('#storyNextLabel');

const storyChapters = [
  {
    label: 'Chapter 01',
    title: 'Where It All Began',
    body: '<p>高一時其實沒有很熟，<br />高二再次同班後，不知不覺就變得很好。</p><p>那時候的我們，無話不談。</p>',
    image: './images/chapter-01.jpg',
    alt: '高中時期的我們',
  },
  {
    label: 'Chapter 02',
    title: 'Our First Trip',
    body: '<p>已經不記得為什麼去了台中，<br />只記得一路吃吃喝喝、瘋狂拍照。</p><p>當然還少不了當時最流行的魚眼鏡頭。</p>',
    image: './images/chapter-02.jpg',
    alt: '第一次一起去台中的旅行',
  },
  {
    label: 'Chapter 03',
    title: 'Our First Time Abroad',
    body: '<p>不知道當時哪來的勇氣，<br />就這樣決定一起去韓國自助旅行。</p><p>我負責所有行程，居然也一路順利完成了。</p>',
    image: './images/chapter-03.jpg',
    alt: '第一次一起出國去韓國',
  },
  {
    label: 'Chapter 04',
    title: 'Hokkaido Days',
    body: '<p>知道妳要去北海道交換，<br />我立刻跟妳約好一定要見到面。</p><p>只希望在離家很遠的地方，妳不會覺得孤單。</p>',
    image: './images/chapter-04.jpg',
    alt: '北海道交換時的回憶',
  },
  {
    label: 'Chapter 05',
    title: 'Before I Left',
    body: '<p>出發去美國前，<br />大家一起幫妳慶生，也一起幫我送行。</p><p>吹氣球、吃蛋糕、拍照，最後再深深抱一下。</p>',
    image: './images/chapter-05.jpg?v=20260819-02',
    alt: '出發去美國前的生日與送行',
  },
  {
    label: 'Chapter 06',
    title: 'Still Making Memories',
    body: '<p>抽中 Lady Gaga 的門票後，<br />我立刻問妳要不要一起去東京，妳也立刻答應。</p><p>這次依舊為了美食奔波，只是換妳負責帶路。</p>',
    image: './images/chapter-06.jpg',
    alt: '2026 東京旅行的我們',
  },
];

let currentStoryChapter = 0;
let storySwitching = false;

function renderStoryChapter(index) {
  const chapter = storyChapters[index];
  if (!chapter) return;

  chapterLabel.textContent = chapter.label;
  chapterTitle.textContent = chapter.title;
  chapterBody.innerHTML = chapter.body;
  chapterImage.src = chapter.image;
  chapterImage.alt = chapter.alt;
  storyProgress.textContent = `${index + 1} of ${storyChapters.length}`;

  const isLast = index === storyChapters.length - 1;
  storyNextLabel.textContent = isLast ? 'Continue' : 'Next Chapter';
  storyNextButton.setAttribute(
    'aria-label',
    isLast ? 'Continue to the next page' : `Go to ${storyChapters[index + 1].label}`
  );
}

if (
  storyCard &&
  chapterLabel &&
  chapterTitle &&
  chapterBody &&
  chapterImage &&
  storyProgress &&
  storyNextButton &&
  storyNextLabel
) {
  renderStoryChapter(0);

  storyNextButton.addEventListener('click', () => {
    if (storySwitching) return;

    if (currentStoryChapter >= storyChapters.length - 1) {
      return;
    }

    storySwitching = true;
    storyNextButton.disabled = true;
    storyCard.classList.add('is-switching');

    window.setTimeout(() => {
      currentStoryChapter += 1;
      renderStoryChapter(currentStoryChapter);
      storyCard.classList.remove('is-switching');
      storyCard.classList.add('is-entering');

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          storyCard.classList.remove('is-entering');
        });
      });
    }, 280);

    window.setTimeout(() => {
      storySwitching = false;
      storyNextButton.disabled = false;
    }, 760);
  });
}
