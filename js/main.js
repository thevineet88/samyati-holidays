// Samyati Holidays — Main JS

// ── Scroll Reveal ──
window.initReveal = function () {
  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('revealed');
    });
  }, 100);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initReveal);
} else {
  window.initReveal();
}

// ── Sticky Nav Shadow ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-header');
  if (nav) {
    if (window.scrollY > 10) {
      nav.classList.add('shadow-md');
    } else {
      nav.classList.remove('shadow-md');
    }
  }
});

// ── Accordion — collapse all on load, then toggle via inline style ──
// Collapse all accordion bodies immediately — no CSS dependency
document.querySelectorAll('.accordion-body').forEach(function (b) {
  b.style.display = 'none';
  b.classList.remove('open');
});

document.addEventListener('click', function (e) {
  var btn = e.target.closest('.accordion-btn');
  if (!btn) return;
  var body = btn.nextElementSibling;
  var icon = btn.querySelector('.accordion-icon');
  var isOpen = body && body.style.display !== 'none';

  if (!isOpen && body) {
    body.style.display = 'block';
    body.classList.add('open');
    icon && icon.classList.add('open');
  } else if (isOpen && body) {
    body.style.display = 'none';
    body.classList.remove('open');
    icon && icon.classList.remove('open');
  }
});

// ── Dynamic Package Renderer ──
// Load packages-data.js (loaded after main.js in HTML), render all cards
function renderPackageCard(pkg) {
  const cats = pkg.category.map((c) => {
    const map = {
      spiritual: 'Spiritual',
      beach: 'Beach',
      adventure: 'Adventure',
      nature: 'Nature & Hills'
    };
    return map[c] || c;
  });
  const catAttr = pkg.category.join(' ');
  const isComingSoon = pkg.comingSoon === true;
  const waMsg = encodeURIComponent(
    'Hi Samyati Holidays! I am interested in the ' + pkg.title + ' package. Please share details.'
  );
  const notifyMsg = encodeURIComponent(
    'Hi! I want to know more about the upcoming ' + pkg.title + ' tour.'
  );
  const opacityClass = isComingSoon ? ' opacity-90' : '';
  const badgeClass = isComingSoon ? 'bg-orange text-white' : 'bg-green-500 text-white';
  const badgeText = isComingSoon ? 'Coming Soon' : 'Seats Available';
  const actionButtons = isComingSoon
    ? '<a href="https://wa.me/919076068549?text=' +
      notifyMsg +
      '" target="_blank" class="btn-outline-navy w-full text-sm py-2">Notify Me</a>'
    : '<a href="' +
      pkg.slug +
      '.html" class="btn-navy flex-1 text-sm py-2">View Details</a>' +
      '<a href="https://wa.me/919076068549?text=' +
      waMsg +
      '" target="_blank" class="btn-whatsapp flex-1 text-sm py-2">WhatsApp Now</a>';
  return (
    '<div class="pkg-card-wrap" data-cat="' +
    catAttr +
    '">' +
    '<div class="package-card' +
    opacityClass +
    '">' +
    '<div class="relative">' +
    '<img loading="lazy" decoding="async" src="' +
    pkg.hero.replace('w=1200', 'w=600') +
    '" alt="' +
    pkg.title +
    '"/>' +
    '<span class="absolute top-3 left-3 bg-navy text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">' +
    cats[0] +
    '</span>' +
    '<span class="absolute top-3 right-3 ' +
    badgeClass +
    ' text-xs font-poppins font-semibold px-3 py-1 rounded-full">' +
    badgeText +
    '</span>' +
    '</div>' +
    '<div class="p-5 flex flex-col flex-1">' +
    '<h3 class="font-poppins font-bold text-navy text-lg mb-2">' +
    pkg.title +
    '</h3>' +
    '<div class="flex flex-wrap gap-2 mb-3">' +
    '<span class="chip">\u{1F4C5} ' +
    pkg.duration +
    '</span>' +
    '<span class="chip">\u{1F4C5} ' +
    pkg.dates +
    '</span>' +
    '</div>' +
    '<div class="flex flex-wrap gap-2 mb-3">' +
    (pkg.highlights && pkg.highlights.length > 0
      ? '<span class="chip">' + pkg.highlights[0] + '</span>'
      : '') +
    '</div>' +
    '<div class="card-actions">' +
    (isComingSoon
      ? actionButtons
      : '<div><p class="text-muted text-xs mb-1">Starting from</p>' +
        '<p class="font-poppins font-bold text-orange text-xl">' +
        pkg.priceLabel +
        '</p></div>' +
        actionButtons) +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

// ── Carousel Sections ──
// One config array drives section creation + card rendering. No duplicated HTML.
var CAROUSEL_SECTIONS = [
  { cat: 'spiritual', label: 'Spiritual Yatras', bg: 'bg-white', order: 1 },
  { cat: 'adventure', label: 'Adventures', bg: 'bg-light-gray', order: 2 },
  { cat: 'nature', label: 'Nature & Hills', bg: 'bg-white', order: 3 },
  { cat: 'beach', label: 'Beach Getaways', bg: 'bg-light-gray', order: 4 }
];

var COMING_SOON_CARDS = [
  {
    title: 'Ladakh - Pangong Lake',
    cat: 'Adventure',
    img: 'kashmir',
    dur: '8D / 7N',
    desc: 'The roof of the world, Magnetic Hill, Pangong Lake, Khardung La and monasteries in the sky.',
    wa: 'Ladakh'
  },
  {
    title: 'Meghalaya - Cherrapunji',
    cat: 'Nature',
    img: 'rann-utsav',
    dur: '7D / 6N',
    desc: 'Living root bridges, Nohkalikai Falls, Dawki river, the abode of clouds is like nowhere else on earth.',
    wa: 'Meghalaya'
  },
  {
    title: 'Andaman Islands',
    cat: 'Adventure',
    img: 'goa',
    dur: '6D / 5N',
    desc: 'Radhanagar Beach, Cellular Jail, glass-bottom kayaking, scuba diving, paradise with a history.',
    wa: 'Andaman'
  },
  {
    title: 'Bhutan',
    cat: 'Adventure',
    img: 'bhutan',
    dur: '7D / 6N',
    desc: 'Thimphu, Paro, and the Himalayan kingdom of happiness -- monasteries, mountains, and untouched nature.',
    wa: 'Bhutan'
  }
];

function carouselSectionHTML(s) {
  return (
    '<section class="reveal py-10 ' +
    s.bg +
    ' carousel-section">' +
    '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
    '<div class="flex items-center gap-3 mb-2">' +
    '<div class="pin-icon"></div><div class="line"></div>' +
    '<p class="section-eyebrow">' +
    s.label +
    '</p>' +
    '</div>' +
    '<h3 class="font-poppins font-bold text-navy text-xl md:text-2xl mb-6">' +
    s.label +
    '</h3>' +
    '</div>' +
    '<div class="max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8">' +
    '<div class="carousel-scroll" data-cat="' +
    s.cat +
    '"></div>' +
    '<button class="carousel-chevron carousel-chevron-left" aria-label="Scroll left">&#8249;</button>' +
    '<button class="carousel-chevron carousel-chevron-right" aria-label="Scroll right">&#8250;</button>' +
    '</div>' +
    '</section>'
  );
}

function comingSoonCardHTML(c) {
  return (
    '<div class="pkg-card-wrap"><div class="package-card opacity-90"><div class="relative">' +
    '<img loading="lazy" decoding="async" src="../assets/images/1200w/' +
    c.img +
    '.webp" alt="' +
    c.title +
    '" />' +
    '<span class="absolute top-3 left-3 bg-navy text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">' +
    c.cat +
    '</span>' +
    '<span class="coming-soon-badge">Coming Soon</span></div>' +
    '<div class="p-5 flex flex-col flex-1">' +
    '<h3 class="font-poppins font-bold text-navy text-lg mb-2">' +
    c.title +
    '</h3>' +
    '<div class="flex flex-wrap gap-2 mb-3"><span class="chip">' +
    c.dur +
    '</span><span class="chip">TBA</span></div>' +
    '<p class="text-muted text-sm leading-relaxed mb-3">' +
    c.desc +
    '</p>' +
    '<div class="card-actions">' +
    '<a href="https://wa.me/919076068549?text=Hi!%20I%20want%20to%20know%20more%20about%20the%20upcoming%20' +
    c.wa +
    '%20tour." target="_blank" class="btn-outline-navy w-full text-sm py-2">Notify Me</a>' +
    '</div>' +
    '</div></div></div>'
  );
}

function initCarousels() {
  if (typeof SAMYATI_PACKAGES === 'undefined') return;
  var container = document.getElementById('carousel-sections');
  if (!container) return;

  var sorted = SAMYATI_PACKAGES.slice().sort(function (a, b) {
    return a.price - b.price;
  });

  // Sort sections by explicit order (no count-based sorting)
  var sortedSections = CAROUSEL_SECTIONS.slice().sort(function (a, b) {
    return a.order - b.order;
  });

  // Build category sections in order
  var html = sortedSections.map(carouselSectionHTML).join('');

  // Coming Soon section at the very end
  html +=
    '<section class="reveal py-10 bg-white carousel-section">' +
    '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
    '<div class="flex items-center gap-3 mb-2">' +
    '<div class="pin-icon"></div><div class="line"></div>' +
    '<p class="section-eyebrow">Coming Soon</p>' +
    '</div>' +
    '<h3 class="font-poppins font-bold text-navy text-xl md:text-2xl mb-6">Coming Soon</h3>' +
    '</div>' +
    '<div class="max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8">' +
    '<div class="carousel-scroll" data-cat="coming-soon">' +
    COMING_SOON_CARDS.map(comingSoonCardHTML).join('') +
    '</div>' +
    '<button class="carousel-chevron carousel-chevron-left" aria-label="Scroll left">&#8249;</button>' +
    '<button class="carousel-chevron carousel-chevron-right" aria-label="Scroll right">&#8250;</button>' +
    '</div>' +
    '</section>';
  container.innerHTML = html;

  // Render package cards into each carousel scroll container
  var scrolls = container.querySelectorAll('.carousel-scroll');
  for (var i = 0; i < scrolls.length; i++) {
    var cat = scrolls[i].dataset.cat;
    if (cat === 'coming-soon') continue;
    var cards = sorted
      .filter(function (p) {
        if ((p.category || []).indexOf(cat) === -1) return false;
        if (p.comingSoon === true) return false;
        return true;
      })
      .map(renderPackageCard)
      .join('');
    scrolls[i].insertAdjacentHTML('beforeend', cards);
  }

  // Re-trigger scroll reveal for dynamically added sections
  if (window.initReveal) window.initReveal();

  // Attach chevron handlers and auto-advance to each carousel
  var wrappers = container.querySelectorAll('.carousel-scroll');
  for (var j = 0; j < wrappers.length; j++) {
    (function (scrollEl) {
      // Find the sibling chevrons inside the same parent .max-w-7xl.mx-auto.relative
      var parent = scrollEl.parentElement;
      var leftBtn = parent.querySelector('.carousel-chevron-left');
      var rightBtn = parent.querySelector('.carousel-chevron-right');
      if (!scrollEl) return;

      var cardWidth = 340 + 20;
      var autoTimer;

      function getMaxScroll() {
        return Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
      }

      function scrollByOne(dir) {
        scrollEl.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
      }

      leftBtn &&
        leftBtn.addEventListener('click', function () {
          scrollByOne(-1);
          resetAuto();
        });
      rightBtn &&
        rightBtn.addEventListener('click', function () {
          scrollByOne(1);
          resetAuto();
        });

      parent.addEventListener('mouseenter', function () {
        clearInterval(autoTimer);
      });
      parent.addEventListener('mouseleave', function () {
        startAuto();
      });

      function updateChevronVisibility() {
        var maxS = getMaxScroll();
        var atStart = scrollEl.scrollLeft <= 2;
        var atEnd = scrollEl.scrollLeft >= maxS - 2;
        if (leftBtn) {
          leftBtn.style.opacity = atStart ? '0' : '1';
          leftBtn.style.pointerEvents = atStart ? 'none' : 'auto';
        }
        if (rightBtn) {
          rightBtn.style.opacity = atEnd ? '0' : '1';
          rightBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
        }
      }

      scrollEl.addEventListener('scroll', updateChevronVisibility);
      window.addEventListener('resize', updateChevronVisibility);
      updateChevronVisibility();

      function startAuto() {
        autoTimer = setInterval(function () {
          var maxS = getMaxScroll();
          if (scrollEl.scrollLeft >= maxS - 2) {
            scrollEl.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollEl.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }, 2000);
      }

      function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
      }

      startAuto();
    })(scrolls[j]);
  }
}

// Old grid-based init: no-op on this page (DOM element absent)
function initPackages() {
  var grid = document.getElementById('packages-grid');
  if (!grid) return;
  if (typeof SAMYATI_PACKAGES === 'undefined') return;
  var sorted = SAMYATI_PACKAGES.slice().sort(function (a, b) {
    return a.price - b.price;
  });
  sorted.forEach(function (pkg) {
    grid.insertAdjacentHTML('beforeend', renderPackageCard(pkg));
  });
  var filterTabs = document.querySelectorAll('.filter-tab');
  var packageCards = document.querySelectorAll('.pkg-card-wrap');
  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) {
        t.classList.remove('active');
      });
      tab.classList.add('active');
      var cat = tab.dataset.cat;
      packageCards.forEach(function (card) {
        if (cat === 'all' || card.dataset.cat.indexOf(cat) !== -1) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPackages);
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initPackages();
  initCarousels();
}

// ── Async Form Submission ──
document.querySelectorAll('form[data-async]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const successEl = form.parentElement.querySelector('.form-success');
    const errorEl = form.parentElement.querySelector('.form-error');
    const origText = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        form.reset();
        if (successEl) {
          successEl.style.display = 'block';
        }
        setTimeout(() => {
          if (successEl) successEl.style.display = 'none';
        }, 6000);
      } else {
        if (errorEl) {
          errorEl.style.display = 'block';
        }
        setTimeout(() => {
          if (errorEl) errorEl.style.display = 'none';
        }, 5000);
      }
    } catch {
      if (errorEl) {
        errorEl.style.display = 'block';
      }
      setTimeout(() => {
        if (errorEl) errorEl.style.display = 'none';
      }, 5000);
    }

    btn.textContent = origText;
    btn.disabled = false;
  });
});

// ── Testimonial Carousel (simple auto-advance on mobile) ──
const carousel = document.getElementById('testimonial-carousel');
if (carousel) {
  let idx = 0;
  const items = carousel.querySelectorAll('.testimonial-item');
  if (items.length > 1 && window.innerWidth < 768) {
    items.forEach((item, i) => {
      item.style.display = i === 0 ? 'block' : 'none';
    });
    setInterval(() => {
      items[idx].style.display = 'none';
      idx = (idx + 1) % items.length;
      items[idx].style.display = 'block';
    }, 4000);
  }
}

// ── Active nav link highlight ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav:not(#mobile-menu) .nav-link').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Lead Capture Popup ──
// Runs on every page. Uses sessionStorage so the popup reappears on a new session.
(function () {
  if (window.__leadPopupInitialized) return;
  window.__leadPopupInitialized = true;

  var KEY = 'samyati_lead_popup_dismissed';
  var popup, btn;

  function dismissed() {
    return sessionStorage.getItem(KEY) === '1';
  }
  function setDismissed() {
    sessionStorage.setItem(KEY, '1');
  }

  function hide() {
    if (!popup) return;
    popup.classList.add('hidden');
    document.body.classList.remove('popup-open');
  }

  function show() {
    if (!popup) return;
    popup.classList.remove('hidden');
    document.body.classList.add('popup-open');
  }

  function initForm() {
    var f = document.getElementById('lead-popup-form');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = f.querySelector('button[type="submit"]');
      var ok = document.getElementById('lead-popup-success');
      var err = document.getElementById('lead-popup-error');
      var t = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      fetch(f.action, {
        method: 'POST',
        body: new FormData(f),
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          if (r.ok) {
            f.reset();
            if (ok) ok.style.display = 'block';
            if (err) err.style.display = 'none';
            setTimeout(hide, 3000);
          } else {
            if (err) err.style.display = 'block';
            setTimeout(function () {
              if (err) err.style.display = 'none';
            }, 5000);
          }
        })
        .catch(function () {
          if (err) err.style.display = 'block';
          setTimeout(function () {
            if (err) err.style.display = 'none';
          }, 5000);
        })
        .finally(function () {
          btn.textContent = t;
          btn.disabled = false;
        });
    });
  }

  function bind() {
    popup = document.getElementById('lead-popup');
    btn = document.getElementById('lead-popup-close');
    if (!popup) return;

    initForm();

    btn.addEventListener('click', function () {
      hide();
      setDismissed();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup && !popup.classList.contains('hidden')) {
        hide();
        setDismissed();
      }
    });
  }

  function tryShow() {
    if (dismissed()) return;
    bind();
    show();
  }

  // For root pages: popup is injected by partials.js asynchronously.
  // For dist/template pages: popup HTML comes after main.js in the DOM.
  if (document.getElementById('lead-popup')) {
    // Dist/template pages: popup already in DOM, show immediately
    tryShow();
  } else {
    // Root pages: wait for partials.js to inject the popup
    window.addEventListener('lead-popup-injected', function () {
      tryShow();
    });
    // Fallback: if the popup is later in the DOM (e.g. dist pages where
    // main.js is loaded before the popup markup), also check after DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        if (document.getElementById('lead-popup')) tryShow();
      });
    }
  }
})();
