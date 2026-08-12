/* =========================================================
   HAPPY 30 — SHARED JAVASCRIPT
   Keep interactions lightweight and progressive.
   ========================================================= */

const beginButton = document.querySelector('#beginButton');
const openingPage = document.querySelector('#opening');
const nextSection = document.querySelector('#loading-memories');

if (beginButton && openingPage) {
  beginButton.addEventListener('click', () => {
    // Prevent repeat clicks while the transition is running.
    if (openingPage.classList.contains('is-leaving')) return;

    openingPage.classList.add('is-leaving');
    beginButton.setAttribute('disabled', '');

    // Page 2 is intentionally not built yet.
    // When Page 2 is added, this same button will smoothly enter it.
    window.setTimeout(() => {
      openingPage.classList.remove('is-leaving');
      beginButton.removeAttribute('disabled');

      if (nextSection && nextSection.offsetHeight > 0) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 650);
  });
}
