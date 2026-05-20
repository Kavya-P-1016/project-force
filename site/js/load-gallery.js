/**
 * Project Force — gallery grid
 * Order: branding first, then manpower, then project photos
 */
(function () {
  'use strict';

  const galleryItems = [
    {
      file: '303510921_435300938664062_3456765291294209545_n.png',
      label: 'Project Force',
      title: 'Water, Wastewater & Energy Services',
    },
    {
      file: '514664379_24020330870993881_3882376744707742587_n.jpg',
      label: 'Skilled Manpower',
      title: 'Engineering Team, Ahmedabad',
    },
    {
      file: '514340861_24022110200815948_1402395434632446145_n.jpg',
      label: 'Skilled Manpower',
      title: 'Project Force Team at Facility',
    },
    {
      file: '513945246_24020330560993912_4392215560678559175_n.jpg',
      label: 'Skilled Manpower',
      title: 'Technical Team at Treatment Plant',
    },
    {
      file: '50485335_2112947032158913_3233029738641489920_n.jpg',
      label: 'Skilled Manpower',
      title: 'Team at Vibrant Gujarat Global Trade Show',
    },
    {
      file: '513576617_24020330940993874_6614442442504378285_n.jpg',
      label: 'Skilled Manpower',
      title: 'Team at Plant Tool Board Ceremony',
    },
    {
      file: '513089604_24020457257647909_5877990045707977175_n.jpg',
      label: 'Water Pollution Control',
      title: 'ETP Pump Room & Piping',
    },
    {
      file: '513094948_24020456960981272_3178353991315753530_n.jpg',
      label: 'Water Pollution Control',
      title: 'Effluent Treatment Pumping Station',
    },
    {
      file: '513249963_24020456927647942_8796585900905268353_n.jpg',
      label: 'Operation & Maintenance',
      title: 'Filtration Vessel Battery',
    },
    {
      file: '513477491_24020456984314603_482813674418355944_n.jpg',
      label: 'Operation & Maintenance',
      title: 'Blower Room & Control Panel',
    },
    {
      file: '513592043_24020457267647908_967975618342989881_n.jpg',
      label: 'Water Pollution Control',
      title: 'Sludge Dewatering Centrifuge',
    },
    {
      file: '513694953_24020457294314572_6114653945263301443_n.jpg',
      label: 'Water Pollution Control',
      title: 'Chemical Dosing Tank & Pumps',
    },
    {
      file: '513868961_24020457280981240_5908021704643537979_n.jpg',
      label: 'Water Pollution Control',
      title: 'ETP Pumping Station',
    },
    {
      file: '513872915_24020330804327221_4405869466866856108_n.jpg',
      label: 'Environmental General',
      title: 'Team Site Visit, Industrial Facility',
    },
    {
      file: '514165890_24020457260981242_5267585220089515768_n.jpg',
      label: 'EPC Contracts',
      title: 'Pressure Filter Vessel Installation',
    },
    {
      file: '514236565_24020456964314605_1934440426827016314_n.jpg',
      label: 'EPC Contracts',
      title: 'Water Treatment Pressure Vessel',
    },
    {
      file: '514548866_24020457277647907_6008565560060576586_n.jpg',
      label: 'Water Pollution Control',
      title: 'Filtration Train & Pipe Rack',
    },
    {
      file: '514718456_24020457310981237_8633695095944239805_n.jpg',
      label: 'EPC Contracts',
      title: 'Treatment Plant Site Inspection',
    },
  ];

  function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = '';

    galleryItems.forEach((item) => {
      const src = `/img/company/${item.file}`;

      const figure = document.createElement('figure');
      figure.className = 'gallery-item reveal';

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Project Force, ${item.title}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 800;
      img.height = 600;

      const caption = document.createElement('figcaption');
      caption.className = 'gallery-caption';
      caption.innerHTML = `
        <span class="gallery-caption-label">${item.label}</span>
        <span class="gallery-caption-title">${item.title}</span>
      `;

      figure.appendChild(img);
      figure.appendChild(caption);
      grid.appendChild(figure);
    });

    const revealItems = grid.querySelectorAll('.reveal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealItems.forEach((el) => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGallery);
  } else {
    loadGallery();
  }
})();
