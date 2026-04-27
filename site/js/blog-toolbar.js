(() => {
  'use strict';

  function normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  function updateFilterLabels(filters, cards) {
    const counts = { all: cards.length };
    cards.forEach((card) => {
      const cat = normalize(card.dataset.category);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    filters.forEach((btn) => {
      const filter = normalize(btn.dataset.filter);
      const base = btn.textContent.replace(/\s*\(\d+\)\s*$/, '');
      const count = filter === 'all' ? counts.all : (counts[filter] || 0);
      btn.textContent = `${base} (${count})`;
    });
  }

  function applyFilter(cards, activeFilter, query) {
    const q = normalize(query);
    cards.forEach((card) => {
      const cat = normalize(card.dataset.category);
      const text = normalize(card.textContent);
      const categoryMatch = activeFilter === 'all' || cat === activeFilter;
      const searchMatch = !q || text.includes(q);
      card.classList.toggle('is-hidden', !(categoryMatch && searchMatch));
    });
  }

  function initBlogToolbar() {
    const toolbar = document.getElementById('blog-toolbar');
    const grid = document.getElementById('blogGrid');
    if (!toolbar || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.blog-card'));
    const filters = Array.from(toolbar.querySelectorAll('.blog-filter'));
    const search = toolbar.querySelector('#blogSearch');
    if (!cards.length || !filters.length || !search) return;

    let activeFilter = 'all';
    updateFilterLabels(filters, cards);
    applyFilter(cards, activeFilter, '');

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = normalize(btn.dataset.filter) || 'all';
        filters.forEach((b) => b.classList.toggle('is-active', b === btn));
        applyFilter(cards, activeFilter, search.value);
      });
    });

    search.addEventListener('input', () => {
      applyFilter(cards, activeFilter, search.value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogToolbar);
  } else {
    initBlogToolbar();
  }
})();
