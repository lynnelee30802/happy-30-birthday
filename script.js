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
const becausePage = document.querySelector('#because-of-you');

let loadingStarted = false;

const loadingSequence = [
  { at: 0, text: 'Loading memories...', progress: 25 },
  { at: 1250, text: 'Finding our best photos...', progress: 50 },
  { at: 2500, text: 'Preparing Chapter 30...', progress: 75 },
  { at: 3750, text: 'Done.', progress: 100 },
  { at: 4910, text: 'Our story is ready.', ready: true, final: true },
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

function transitionToStory() {
  if (!loadingPage || !storyPage) return;

  loadingPage.style.transition = 'opacity 420ms ease';
  loadingPage.style.opacity = '0';

  window.setTimeout(() => {
    loadingPage.hidden = true;
    loadingPage.style.display = 'none';
    loadingPage.style.removeProperty('transition');
    loadingPage.style.removeProperty('opacity');

    storyPage.hidden = false;
    storyPage.classList.add('is-entering');
    storyPage.scrollIntoView({ behavior: 'auto', block: 'start' });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        storyPage.classList.remove('is-entering');
      });
    });
  }, 420);
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

  window.setTimeout(transitionToStory, 6200);
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
    body: '<p>高一時其實沒有很熟，<br />而高二再次同班後，不知不覺就變得很好～</p><p>那時候的我們，無話不談！</p>',
    image: './images/chapter-01.jpg',
    alt: '高中時期的我們',
    fit: 'cover',
  },
  {
    label: 'Chapter 02',
    title: 'Our First Trip',
    body: '<p>已經不記得為什麼去了台中，<br />只記得一路吃吃喝喝、瘋狂拍照～</p><p>當然少不了當時最流行的「魚眼」囉！</p>',
    image: './images/chapter-02.jpg',
    alt: '第一次一起去台中的旅行',
    fit: 'contain',
  },
  {
    label: 'Chapter 03',
    title: 'Our First Time Abroad',
    body: '<p>不知道當時哪來的勇氣，<br />就這樣決定一起去韓國自助旅行，</p><p>我負責排行程，妳負責跟著走，玩好玩滿！</p>',
    image: './images/chapter-03.jpg',
    alt: '第一次一起出國去韓國',
    fit: 'cover',
  },
  {
    label: 'Chapter 04',
    title: 'Hokkaido Days',
    body: '<p>知道妳要去北海道交換後，<br />立刻跟妳約好一定要見到面！</p><p>只希望在離家很遠的地方，妳不會覺得孤單～</p>',
    image: './images/chapter-04.jpg',
    alt: '北海道交換時的回憶',
    fit: 'cover',
  },
  {
    label: 'Chapter 05',
    title: 'Before I Left',
    body: '<p>出發去美國前，<br />一起幫妳慶生，也一起幫我送行～</p><p>吹氣球、吃蛋糕、拍照，約定好很快會再相見：）</p>',
    image: './images/chapter-05.jpg?v=20260819-02',
    alt: '出發去美國前的生日與送行',
    fit: 'cover',
  },
  {
    label: 'Chapter 06',
    title: 'Still Making Memories',
    body: '<p>抽中 Lady Gaga 的門票後，<br />我立刻問妳要不要一起去，妳也立刻答應～</p><p>這次依舊為了美食奔波，只是換妳負責帶路！</p>',
    image: './images/chapter-06.jpg',
    alt: '2026 東京旅行的我們',
    fit: 'cover',
  },
];

storyChapters.forEach((chapter) => {
  const image = new Image();
  image.src = chapter.image;
});

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
  chapterImage.classList.toggle('is-contain', chapter.fit === 'contain');
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
      if (!becausePage) return;

      storyPage.style.transition = 'opacity 420ms ease';
      storyPage.style.opacity = '0';

      window.setTimeout(() => {
        storyPage.hidden = true;
        storyPage.style.display = 'none';
        storyPage.style.removeProperty('transition');
        storyPage.style.removeProperty('opacity');

        becausePage.hidden = false;
        becausePage.classList.add('is-entering');
        becausePage.scrollIntoView({ behavior: 'auto', block: 'start' });

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            becausePage.classList.remove('is-entering');
          });
        });
      }, 420);
      return;
    }

    storySwitching = true;
    storyNextButton.disabled = true;
    storyCard.classList.add('is-switching');

    window.setTimeout(() => {
      currentStoryChapter += 1;
      renderStoryChapter(currentStoryChapter);

      window.requestAnimationFrame(() => {
        storyCard.classList.remove('is-switching');
      });
    }, 260);

    window.setTimeout(() => {
      storySwitching = false;
      storyNextButton.disabled = false;
    }, 560);
  });
}


/* Page 4 — full-screen horizontal Keynote carousel. */
const becauseTrack = document.querySelector('#becauseTrack');
const becausePanels = becauseTrack ? Array.from(becauseTrack.querySelectorAll('.because-panel')) : [];
const becauseNextButtons = becauseTrack ? Array.from(becauseTrack.querySelectorAll('.because-next-button')) : [];

becauseNextButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!becauseTrack) return;
    const panel = button.closest('.because-panel');
    const index = becausePanels.indexOf(panel);
    const nextPanel = becausePanels[index + 1];
    if (nextPanel) {
      nextPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  });
});


/* Page 5 — future wishlist. */
const becauseContinueButton = document.querySelector('#becauseContinueButton');
const futurePage = document.querySelector('#future-plans');
const futureContent = document.querySelector('#futureContent');
const futureOptions = Array.from(document.querySelectorAll('.future-option'));
const futureSaveButton = document.querySelector('#futureSaveButton');
const futureResult = document.querySelector('#futureResult');
const futureEaster = document.querySelector('#futureEaster');

if (becauseContinueButton && becausePage && futurePage) {
  becauseContinueButton.addEventListener('click', () => {
    becausePage.style.transition = 'opacity 420ms ease';
    becausePage.style.opacity = '0';

    window.setTimeout(() => {
      becausePage.hidden = true;
      becausePage.style.display = 'none';
      becausePage.style.removeProperty('transition');
      becausePage.style.removeProperty('opacity');

      futurePage.hidden = false;
      futurePage.classList.add('is-entering');
      futurePage.scrollIntoView({ behavior: 'auto', block: 'start' });

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          futurePage.classList.remove('is-entering');
        });
      });
    }, 420);
  });
}

futureOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const selected = option.classList.toggle('is-selected');
    option.setAttribute('aria-pressed', String(selected));

    if (futureSaveButton) {
      futureSaveButton.disabled = !futureOptions.some((item) => item.classList.contains('is-selected'));
    }
  });
});

if (futureSaveButton && futureContent && futureResult) {
  futureSaveButton.addEventListener('click', () => {
    const selectedCount = futureOptions.filter((item) => item.classList.contains('is-selected')).length;
    if (!selectedCount) return;

    futureSaveButton.disabled = true;
    futureSaveButton.hidden = true;
    futureContent.classList.add('is-leaving');

    window.setTimeout(() => {
      futureContent.hidden = true;
      futureSaveButton.hidden = true;
      futureResult.hidden = false;

      if (futureEaster) {
        futureEaster.hidden = selectedCount !== futureOptions.length;
      }

      futureResult.classList.add('is-entering');
    }, 320);
  });
}


/* Page 6 — quiet intro and naturally scrolling birthday letter. */
const futureContinueButton = document.querySelector('.future-continue-button');
const letterPage = document.querySelector('#birthday-letter');
const letterIntro = document.querySelector('#letterIntro');
const letterOpenButton = document.querySelector('#letterOpenButton');
const letterReader = document.querySelector('#letterReader');
const letterParagraphs = Array.from(document.querySelectorAll('.letter-paragraph'));

if (futureContinueButton && futurePage && letterPage) {
  futureContinueButton.addEventListener('click', () => {
    futurePage.style.transition = 'opacity 420ms ease';
    futurePage.style.opacity = '0';

    window.setTimeout(() => {
      futurePage.hidden = true;
      futurePage.style.display = 'none';
      futurePage.style.removeProperty('transition');
      futurePage.style.removeProperty('opacity');

      letterPage.hidden = false;
      letterPage.classList.add('is-entering');
      letterPage.scrollIntoView({ behavior: 'auto', block: 'start' });

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          letterPage.classList.remove('is-entering');
        });
      });
    }, 420);
  });
}

let letterObserver = null;

function startLetterReveal() {
  if (!letterParagraphs.length) return;

  if (!('IntersectionObserver' in window)) {
    letterParagraphs.forEach((paragraph) => paragraph.classList.add('is-visible'));
    return;
  }

  if (letterObserver) letterObserver.disconnect();

  letterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -7% 0px',
  });

  letterParagraphs.forEach((paragraph) => letterObserver.observe(paragraph));
}

if (letterOpenButton && letterIntro && letterReader && letterPage) {
  letterOpenButton.addEventListener('click', () => {
    if (letterIntro.classList.contains('is-leaving')) return;

    letterIntro.classList.add('is-leaving');
    letterOpenButton.disabled = true;

    window.setTimeout(() => {
      letterIntro.hidden = true;
      letterIntro.style.display = 'none';
      letterReader.hidden = false;
      letterReader.style.display = 'block';
      letterReader.classList.add('is-entering');

      letterParagraphs.slice(0, 3).forEach((paragraph) => paragraph.classList.add('is-visible'));
      letterReader.scrollIntoView({ behavior: 'auto', block: 'start' });
      startLetterReveal();
    }, 380);
  });
}


const letterContinueButton = document.querySelector('#letterContinueButton');
const endingPage = document.querySelector('#birthday-ending');

if (letterContinueButton && letterPage && endingPage) {
  letterContinueButton.addEventListener('click', () => {
    letterPage.style.transition = 'opacity 420ms ease';
    letterPage.style.opacity = '0';

    window.setTimeout(() => {
      letterPage.hidden = true;
      letterPage.style.display = 'none';
      letterPage.style.removeProperty('transition');
      letterPage.style.removeProperty('opacity');

      endingPage.hidden = false;
      endingPage.classList.add('is-entering');
      endingPage.scrollIntoView({ behavior: 'auto', block: 'start' });

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          endingPage.classList.remove('is-entering');
          endingPage.classList.add('is-revealed');
        });
      });
    }, 420);
  });
}
