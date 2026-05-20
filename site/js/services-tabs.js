/**
 * Services tabs, standalone init (home page)
 */
(function () {
  'use strict';

  function initServicesTabs() {
    const root = document.querySelector('[data-services-tabs]');
    if (!root) return;

    const titleEl = document.getElementById('servicesTabTitle');
    const descEl = document.getElementById('servicesTabDesc');
    const listEl = document.getElementById('servicesTabList');
    const imageEl = document.getElementById('servicesTabImage');
    const linkEl = document.getElementById('servicesTabLink');
    const panelEl = root.querySelector('.services-tabs-panel');
    if (!titleEl || !descEl || !listEl || !imageEl || !linkEl) return;

    const tabs = Array.from(root.querySelectorAll('.services-tab'));
    if (!tabs.length) return;

    const activate = (tab) => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
      });

      if (panelEl) {
        panelEl.setAttribute('aria-labelledby', tab.id || 'servicesTabTitle');
      }

      titleEl.textContent = tab.dataset.title || '';
      descEl.textContent = tab.dataset.desc || '';
      const nextSrc = tab.dataset.image || imageEl.getAttribute('src');
      if (nextSrc && imageEl.getAttribute('src') !== nextSrc) {
        imageEl.src = nextSrc;
      }
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

    tabs.forEach((tab, index) => {
      if (!tab.id) tab.id = `services-tab-${index}`;
      tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;
    });

    root.addEventListener('click', (event) => {
      const tab = event.target.closest('.services-tab');
      if (!tab || !root.contains(tab)) return;
      event.preventDefault();
      activate(tab);
    });

    root.addEventListener('keydown', (event) => {
      const tab = event.target.closest('.services-tab');
      if (!tab || !root.contains(tab)) return;

      const index = tabs.indexOf(tab);
      if (index < 0) return;

      let nextIndex = index;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate(tab);
        return;
      } else {
        return;
      }

      tabs[nextIndex].focus();
      activate(tabs[nextIndex]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesTabs);
  } else {
    initServicesTabs();
  }
})();
