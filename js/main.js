// Samyati Holidays — Main JS

// ── Mobile Nav Toggle ──
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const icon = menuBtn.querySelector('svg');
    // swap hamburger ↔ X
    if (mobileMenu.classList.contains('open')) {
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
    } else {
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
    }
  });
}

// ── Sticky Nav Shadow ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (nav) {
    if (window.scrollY > 10) {
      nav.classList.add('shadow-md');
    } else {
      nav.classList.remove('shadow-md');
    }
  }
});

// ── Accordion ──
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    const icon = btn.querySelector('.accordion-icon');
    const isOpen = body.classList.contains('open');

    // close all
    document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('open'));

    if (!isOpen) {
      body.classList.add('open');
      icon && icon.classList.add('open');
    }
  });
});

// ── Package Filter Tabs ──
const filterTabs = document.querySelectorAll('.filter-tab');
const packageCards = document.querySelectorAll('.pkg-card-wrap');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const cat = tab.dataset.cat;
    packageCards.forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── Async Form Submission ──
document.querySelectorAll('form[data-async]').forEach(form => {
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
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        if (successEl) { successEl.style.display = 'block'; }
        setTimeout(() => { if (successEl) successEl.style.display = 'none'; }, 6000);
      } else {
        if (errorEl) { errorEl.style.display = 'block'; }
        setTimeout(() => { if (errorEl) errorEl.style.display = 'none'; }, 5000);
      }
    } catch {
      if (errorEl) { errorEl.style.display = 'block'; }
      setTimeout(() => { if (errorEl) errorEl.style.display = 'none'; }, 5000);
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
    items.forEach((item, i) => { item.style.display = i === 0 ? 'block' : 'none'; });
    setInterval(() => {
      items[idx].style.display = 'none';
      idx = (idx + 1) % items.length;
      items[idx].style.display = 'block';
    }, 4000);
  }
}

// ── Active nav link highlight ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
