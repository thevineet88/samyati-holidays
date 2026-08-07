// Samyati Holidays — Main JS

// ── Scroll Reveal ──
window.initReveal = function () {
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
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
    '<div class="flex flex-wrap gap-2 mb-4">' +
    pkg.highlights
      .slice(0, 3)
      .map((h) => '<span class="chip">' + h + '</span>')
      .join('') +
    '</div>' +
    '<div class="mt-auto">' +
    (isComingSoon
      ? ''
      : '<p class="text-muted text-xs mb-1">Starting from</p>' +
        '<p class="font-poppins font-bold text-orange text-2xl mb-4">' +
        pkg.priceLabel +
        '<span class="text-sm font-semibold text-muted">/-</span></p>') +
    '<div class="flex gap-2">' +
    actionButtons +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

function initPackages() {
  if (typeof SAMYATI_PACKAGES === 'undefined') return;
  var grid = document.getElementById('packages-grid');
  if (!grid) return;

  var sorted = SAMYATI_PACKAGES.slice().sort(function (a, b) {
    return a.price - b.price;
  });

  sorted.forEach(function (pkg) {
    grid.insertAdjacentHTML('beforeend', renderPackageCard(pkg));
  });

  // Re-bind filter tabs to the dynamically rendered cards
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
} else {
  initPackages();
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
