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
    let visible = 0;
    cards.forEach((card) => {
      const cat = normalize(card.dataset.category);
      const text = normalize(card.textContent);
      const categoryMatch = activeFilter === 'all' || cat === activeFilter;
      const searchMatch = !q || text.includes(q);
      const isVisible = categoryMatch && searchMatch;
      if (isVisible) visible += 1;
      card.classList.toggle('is-hidden', !isVisible);
    });
    return visible;
  }

  function initBlogToolbar() {
    const toolbar = document.getElementById('blog-toolbar');
    const grid = document.getElementById('blogGrid');
    if (!toolbar || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.blog-card'));
    const filters = Array.from(toolbar.querySelectorAll('.blog-filter'));
    const search = toolbar.querySelector('#blogSearch');
    const results = document.getElementById('blogResultsCount');
    if (!cards.length || !filters.length || !search) return;

    const updateResults = (visibleCount) => {
      if (!results) return;
      results.textContent = `Showing ${visibleCount} of ${cards.length} articles`;
    };

    let activeFilter = 'all';
    updateFilterLabels(filters, cards);
    updateResults(applyFilter(cards, activeFilter, ''));

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = normalize(btn.dataset.filter) || 'all';
        filters.forEach((b) => b.classList.toggle('is-active', b === btn));
        updateResults(applyFilter(cards, activeFilter, search.value));
      });
    });

    search.addEventListener('input', () => {
      updateResults(applyFilter(cards, activeFilter, search.value));
    });

    const openBlogPost = (card, event) => {
      event.preventDefault();
      const href = card.getAttribute('href') || '';
      const slug = href.split('/').pop()?.replace('.html', '') || 'blog-article';
      const image = card.querySelector('.blog-card-media img');
      const tag = card.querySelector('.blog-card-tag');
      const meta = card.querySelectorAll('.blog-card-meta span');
      const title = card.querySelector('h3');
      const excerpt = card.querySelector('p');

      const params = new URLSearchParams({
        slug,
        image: image?.getAttribute('src') || '',
        alt: image?.getAttribute('alt') || 'Blog article image',
        tag: (tag?.textContent || '').trim(),
        date: (meta[0]?.textContent || '').trim(),
        read: (meta[2]?.textContent || '').trim(),
        title: (title?.textContent || '').trim(),
        excerpt: (excerpt?.textContent || '').trim()
      });

      window.location.href = `/blog-post.html?${params.toString()}`;
    };

    // Per-card handler.
    cards.forEach((card) => {
      card.addEventListener('click', (event) => openBlogPost(card, event));
    });

    // Delegated fallback to survive cached/partial DOM states.
    grid.addEventListener('click', (event) => {
      const card = event.target.closest('.blog-card');
      if (!card || !grid.contains(card)) return;
      openBlogPost(card, event);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogToolbar);
  } else {
    initBlogToolbar();
  }
})();
