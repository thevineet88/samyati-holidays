// Samyati Holidays — Package Search
// Waits for the header partial to be injected, then binds search UI.
// Reads SAMYATI_PACKAGES from packages-data.js for live filtering.

(function () {
  'use strict';

  var isOpen = false;
  var toggleBtn, toggleBtnMobile, panel, input, results, closeBtn;

  function bind() {
    toggleBtn = document.getElementById('search-toggle-btn');
    toggleBtnMobile = document.getElementById('search-toggle-btn-mobile');
    panel = document.getElementById('search-panel');
    input = document.getElementById('search-input');
    results = document.getElementById('search-results');
    closeBtn = document.getElementById('search-close-btn');

    if (!panel || !input) return;

    function open() {
      if (isOpen) return;
      isOpen = true;
      panel.classList.remove('hidden');
      input.value = '';
      if (results) results.innerHTML = '';
      input.focus();
      document.body.style.overflow = 'hidden';
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.add('hidden');
      if (results) results.innerHTML = '';
      document.body.style.overflow = '';
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        open();
      });
    }
    if (toggleBtnMobile) {
      toggleBtnMobile.addEventListener('click', function (e) {
        e.stopPropagation();
        open();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    document.addEventListener('click', function (e) {
      if (!isOpen) return;
      if (panel.contains(e.target)) return;
      if (e.target === toggleBtn || e.target === toggleBtnMobile) return;
      if (toggleBtn && toggleBtn.contains(e.target)) return;
      if (toggleBtnMobile && toggleBtnMobile.contains(e.target)) return;
      close();
    });

    // Live filtering — only if package data is available
    if (typeof SAMYATI_PACKAGES !== 'undefined') {
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();
        if (q.length < 2) {
          results.innerHTML = '';
          return;
        }

        var matches = SAMYATI_PACKAGES.filter(function (pkg) {
          var haystack = [
            pkg.title,
            pkg.subtitle,
            pkg.duration,
            pkg.dates,
            (pkg.category || []).join(' ')
          ].join(' ');
          return haystack.toLowerCase().indexOf(q) !== -1;
        });

        if (matches.length === 0) {
          results.innerHTML =
            '<p class="search-no-results">No packages found. Try a different search.</p>';
          return;
        }

        results.innerHTML = matches
          .map(function (pkg) {
            var img = pkg.hero ? pkg.hero.replace('/1200w/', '/600w/') : '';
            var cats = (pkg.category || [])
              .slice(0, 2)
              .map(function (c) {
                return c.charAt(0).toUpperCase() + c.slice(1);
              })
              .join(', ');
            var thumbStyle = img ? 'background-image:url(' + img + ');' : '';

            return (
              '<a class="search-result-item" href="' +
              pkg.slug +
              '.html">' +
              '<div class="search-result-img" style="' +
              thumbStyle +
              '"></div>' +
              '<div class="search-result-info">' +
              '<p class="search-result-title">' +
              pkg.title +
              '</p>' +
              '<p class="search-result-meta">' +
              '<span>' +
              pkg.duration +
              '</span>' +
              '<span>' +
              pkg.dates +
              '</span>' +
              (cats ? '<span>' + cats + '</span>' : '') +
              '</p>' +
              '<p class="search-result-price">' +
              pkg.priceLabel +
              '</p>' +
              '</div>' +
              '</a>'
            );
          })
          .join('');
      });
    }
  }

  // Poll until the header partial is injected (partials.js is async)
  function waitForHeader() {
    if (document.getElementById('search-toggle-btn')) {
      bind();
    } else {
      setTimeout(waitForHeader, 100);
    }
  }
  waitForHeader();
})();
