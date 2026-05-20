/**
 * About section manpower photo slider (homepage)
 */
(function () {
  'use strict';

  const INTERVAL_MS = 3500;

  function initAboutManpowerSlider() {
    const root = document.querySelector('[data-about-manpower-slider]');
    if (!root || root.dataset.sliderReady === 'true') return;

    const slides = Array.from(root.querySelectorAll('.about-split-slide'));
    const prevBtn = root.querySelector('.about-split-nav--prev');
    const nextBtn = root.querySelector('.about-split-nav--next');
    if (slides.length < 2) return;

    root.dataset.sliderReady = 'true';

    let idx = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (idx < 0) idx = 0;

    let timer = null;

    const syncSlides = () => {
      slides.forEach((slide, i) => {
        const isActive = i === idx;
        slide.classList.toggle('is-active', isActive);
        if (isActive) {
          slide.removeAttribute('aria-hidden');
        } else {
          slide.setAttribute('aria-hidden', 'true');
        }
      });
    };

    const show = (targetIndex) => {
      const nextIndex = ((targetIndex % slides.length) + slides.length) % slides.length;
      if (nextIndex === idx) return;
      idx = nextIndex;
      syncSlides();
    };

    const next = () => show(idx + 1);
    const prev = () => show(idx - 1);

    const start = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(next, INTERVAL_MS);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    syncSlides();

    if (prevBtn) {
      prevBtn.addEventListener('click', (event) => {
        event.preventDefault();
        prev();
        start();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (event) => {
        event.preventDefault();
        next();
        start();
      });
    }

    start();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutManpowerSlider);
  } else {
    initAboutManpowerSlider();
  }
})();
