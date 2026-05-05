/**
 * Project Force — main.js
 * Handles partial injection (nav + footer), navbar scroll state, mobile menu,
 * animated stat counters, hero crossfade slider, interactive adv cards,
 * accordions, and reveal-on-scroll animations.
 *
 * Vanilla ES6+, no dependencies. Safe to load with `defer`.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -----------------------------------------------------------------------
  // Partial injection (nav + footer)
  // -----------------------------------------------------------------------
  async function injectPartials() {
    const navMount = document.getElementById('site-nav');
    const footerMount = document.getElementById('site-footer');

    const tasks = [];
    if (navMount) {
      tasks.push(
        fetch('/partials/nav.html', { cache: 'no-cache' })
          .then((r) => r.text())
          .then((html) => { navMount.innerHTML = html; })
          .catch(() => {})
      );
    }
    if (footerMount) {
      tasks.push(
        fetch('/partials/footer.html', { cache: 'no-cache' })
          .then((r) => r.text())
          .then((html) => { footerMount.innerHTML = html; })
          .catch(() => {})
      );
    }
    await Promise.all(tasks);
  }

  // -----------------------------------------------------------------------
  // Navbar: scroll state + active link + mobile menu
  // -----------------------------------------------------------------------
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const apply = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });

    // Active link marker
    const page = document.body.dataset.page;
    if (page) {
      navbar.querySelectorAll('.nav-link[data-nav]').forEach((a) => {
        if (a.dataset.nav === page) a.classList.add('active');
      });
    }

    const hamburger = navbar.querySelector('.navbar-hamburger');
    const links = navbar.querySelector('.navbar-links');
    if (hamburger && links) {
      hamburger.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          links.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // -----------------------------------------------------------------------
  // Year + service pre-select (kept from original behavior)
  // -----------------------------------------------------------------------
  function initYearAndPreselect() {
    document.querySelectorAll('#currentYear').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    const params = new URLSearchParams(window.location.search);
    const preselectService = params.get('service');
    if (preselectService) {
      const sel = document.getElementById('service');
      if (sel) {
        const opt = Array.from(sel.options).find((o) => o.value === preselectService);
        if (opt) sel.value = preselectService;
      }
    }
  }

  // -----------------------------------------------------------------------
  // Animated number counters (IntersectionObserver)
  // -----------------------------------------------------------------------
  function animateNumber(el) {
    const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.\-]/g, '')) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = parseInt(el.dataset.duration || '1600', 10);
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    if (prefersReducedMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const value = target * easeOutCubic(t);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initLiveNumbers() {
    const targets = document.querySelectorAll('.stat-number, .mini-stat-num, [data-animate-number]');
    if (!targets.length) return;

    targets.forEach((el) => {
      // Pre-fill with 0 to avoid layout shift
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      if (el.dataset.target) {
        el.textContent = prefix + '0' + suffix;
      }
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(animateNumber);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateNumber(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    targets.forEach((el) => io.observe(el));
  }

  // -----------------------------------------------------------------------
  // Hero crossfade slider (dual-frame)
  // -----------------------------------------------------------------------
  function initHeroSlider() {
    const hero = document.querySelector('.hero-cinematic');
    if (!hero) return;

    let images = [];
    let positions = [];
    try {
      images = JSON.parse(hero.dataset.heroImages || '[]');
      positions = JSON.parse(hero.dataset.heroPositions || '[]');
    } catch (e) {
      return;
    }
    if (!images.length) return;

    const frames = hero.querySelectorAll('.hero-frame');
    if (frames.length < 2) return;

    let idx = 0;
    const setFrame = (frame, i) => {
      frame.style.backgroundImage = `url('${images[i]}')`;
      if (positions[i]) frame.style.backgroundPosition = positions[i];
    };

    setFrame(frames[0], 0);
    frames[0].classList.add('is-active');
    if (images.length > 1) setFrame(frames[1], 1 % images.length);

    const dotsContainer = hero.querySelector('.hero-dots');
    const dots = [];
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      images.forEach((_, i) => {
        const b = document.createElement('button');
        b.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', `Show slide ${i + 1}`);
        b.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(b);
        dots.push(b);
      });
    }

    let active = 0; // which frame index (0 or 1) currently shown
    let timer = null;

    function goTo(i) {
      if (i === idx) return;
      const next = (active + 1) % 2;
      setFrame(frames[next], i);
      // Force reflow to ensure the opacity transition fires
      // eslint-disable-next-line no-unused-expressions
      frames[next].offsetHeight;
      frames[next].classList.add('is-active');
      frames[active].classList.remove('is-active');
      active = next;
      idx = i;
      dots.forEach((d, di) => d.classList.toggle('is-active', di === idx));
      restart();
    }

    function next() {
      goTo((idx + 1) % images.length);
    }

    function restart() {
      if (prefersReducedMotion || images.length < 2) return;
      if (timer) clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    restart();

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (timer) { clearInterval(timer); timer = null; }
      } else {
        restart();
      }
    });
  }

  // -----------------------------------------------------------------------
  // Advantage cards (single-select interactive)
  // -----------------------------------------------------------------------
  function initAdvCards() {
    const group = document.querySelector('[data-adv-group]');
    if (!group) return;
    const cards = group.querySelectorAll('.adv-card');
    if (!cards.length) return;

    cards.forEach((card, i) => {
      if (i === 0) card.classList.add('is-selected');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      const toggle = () => {
        cards.forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // Services tabs (left list -> right details)
  // -----------------------------------------------------------------------
  function initServicesTabs() {
    const root = document.querySelector('[data-services-tabs]');
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll('.services-tab'));
    const titleEl = document.getElementById('servicesTabTitle');
    const descEl = document.getElementById('servicesTabDesc');
    const listEl = document.getElementById('servicesTabList');
    const imageEl = document.getElementById('servicesTabImage');
    const linkEl = document.getElementById('servicesTabLink');
    if (!tabs.length || !titleEl || !descEl || !listEl || !imageEl || !linkEl) return;

    const activate = (tab) => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      titleEl.textContent = tab.dataset.title || '';
      descEl.textContent = tab.dataset.desc || '';
      imageEl.src = tab.dataset.image || imageEl.src;
      imageEl.alt = `${tab.dataset.title || 'Service'} by Project Force`;
      linkEl.href = tab.dataset.link || '/services.html';

      const points = (tab.dataset.points || '')
        .split('|')
        .map((p) => p.trim())
        .filter(Boolean);
      listEl.innerHTML = '';
      points.forEach((point) => {
        const li = document.createElement('li');
        li.textContent = point;
        listEl.appendChild(li);
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(tab);
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // Accordions
  // -----------------------------------------------------------------------
  function initAccordions() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');
      if (!trigger || !panel) return;
      trigger.addEventListener('click', () => {
        const open = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      });
    });
  }

  // -----------------------------------------------------------------------
  // Reveal on scroll
  // -----------------------------------------------------------------------
  function initReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => io.observe(el));
  }

  // -----------------------------------------------------------------------
  // Boot
  // -----------------------------------------------------------------------
  async function boot() {
    await injectPartials();
    initNavbar();
    initYearAndPreselect();
    initLiveNumbers();
    initHeroSlider();
    initAdvCards();
    initServicesTabs();
    initAccordions();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
