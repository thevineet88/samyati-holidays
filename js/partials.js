// Injects header and footer partials into hand-written pages.
// Pages use HTML comment markers where header/footer should appear:
//   <!-- PARTIAL_HEADER -->
//   <!-- PARTIAL_FOOTER -->
// The <body> element carries:
//   data-page="home|packages|about|contact"  (for active nav link)
//   data-wa-link="https://wa.me/..."           (for the WhatsApp CTA)

const PARTIALS = {};

function loadPartial(name) {
  if (PARTIALS[name]) return Promise.resolve(PARTIALS[name]);
  return fetch(`_partials/${name}.html`)
    .then((r) => {
      if (!r.ok) throw new Error(`partial ${name} not found`);
      return r.text();
    })
    .then((text) => {
      PARTIALS[name] = text;
      return text;
    });
}

function resolveTemplates(html) {
  // Resolve active-page class tokens: {{ACTIVE_HOME}}, {{ACTIVE_PACKAGES}}, etc.
  const page = document.body.dataset.page || 'home';
  const activeMap = { home: 'HOME', packages: 'PACKAGES', about: 'ABOUT', contact: 'CONTACT' };
  const target = activeMap[page] || 'HOME';
  html = html.replace(/\{\{ACTIVE_(\w+)\}\}/g, (_, key) =>
    key === target ? ' active' : ''
  );

  // Resolve WA link: {{WA_LINK_GENERAL}} -> actual URL from body data attribute
  const waLink = document.body.dataset.waLink || '';
  html = html.replace(/\{\{\s*WA_LINK_GENERAL\s*\}\}/g, waLink);

  // Populate dynamic year
  html = html.replace(/\{\{\s*CURRENT_YEAR\s*\}\}/g, new Date().getFullYear());

  return html;
}

function inject(marker, html) {
  const resolved = resolveTemplates(html);
  const walker = document.createTreeWalker(
    document.body,
    window.NodeFilter.SHOW_COMMENT,
    null
  );
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim() === marker) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = resolved;
      const frag = document.createDocumentFragment();
      while (wrapper.firstChild) frag.appendChild(wrapper.firstChild);
      node.parentNode.replaceChild(frag, node);
      return true;
    }
  }
  return false;
}

async function init() {
  try {
    const [header, footer] = await Promise.all([
      loadPartial('header'),
      loadPartial('footer'),
    ]);
    inject('PARTIAL_HEADER', header);
    inject('PARTIAL_FOOTER', footer);
  } catch (e) {
    console.warn('Partial injection failed:', e);
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
