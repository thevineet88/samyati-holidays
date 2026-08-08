#!/usr/bin/env node
/**
 * build.js — SSG: reads packages.json, renders each package page through
 * template.html (simple {{VARIABLE}} substitution), outputs to dist/.
 *
 * Usage:  node build.js
 * Output: dist/ directory with one <slug>.html per package
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname);
const PACKAGES_DIR = path.join(ROOT, 'packages');
const TEMPLATE = path.join(ROOT, 'template.html');
const DIST = path.join(ROOT, 'dist');
const PARTIALS_DIR = path.join(ROOT, '_partials');

// Load all package data files from packages/*.json
function loadPackages() {
  const files = fs
    .readdirSync(PACKAGES_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(PACKAGES_DIR, f), 'utf8')));
}

function loadPartial(name) {
  const file = path.join(PARTIALS_DIR, name + '.html');
  if (!fs.existsSync(file)) throw new Error(`partial ${name}.html not found`);
  return fs.readFileSync(file, 'utf8');
}

function resolvePartialTokens(html, ctx) {
  const page = (ctx && ctx.page) || 'home';
  const activeMap = { home: 'HOME', packages: 'PACKAGES', about: 'ABOUT', contact: 'CONTACT' };
  const target = activeMap[page] || 'HOME';
  html = html.replace(/\{\{ACTIVE_(\w+)\}\}/g, (_, key) => (key === target ? ' active' : ''));
  html = html.replace(/\{\{\s*WA_LINK_GENERAL\s*\}\}/g, ctx.waLink);
  html = html.replace(/\{\{\s*CURRENT_YEAR\s*\}\}/g, '2026');
  return html;
}

// ── helpers ───────────────────────────────────────────────────────────

function h(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPackage(pkg, allPkgs) {
  const catLabels = {
    spiritual: 'Spiritual',
    adventure: 'Adventure',
    beach: 'Beach',
    nature: 'Nature & Hills',
    'ladies-special': 'Ladies Special',
    'parents-special': 'Parents Special'
  };

  const cats = (pkg.category || [])
    .map(
      (c) =>
        `<span class="bg-navy text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full mb-3 inline-block">${h(catLabels[c] || c)}</span>`
    )
    .join('\n      ');

  const transportIcon =
    pkg.transport === 'Flight'
      ? '&#9992;'
      : pkg.transport && pkg.transport.includes('Bus')
        ? '&#128663;'
        : '&#128642;';

  const itinerary = (pkg.itinerary || [])
    .map((day) => {
      const meals = day.meals
        ? `<span class="text-xs font-poppins font-semibold text-orange">&#127858; ${h(day.meals)}</span>`
        : '';
      return `<div class="accordion-item">
      <button class="accordion-btn">
        <div class="flex items-center gap-3"><div class="day-badge">${day.day}</div><span>Day ${day.day}, ${h(day.title)}</span></div>
        <svg class="accordion-icon w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div class="accordion-body pb-4 pl-11">
        <p class="text-gray-600 text-sm mb-2">${h(day.description)}</p>
        ${meals}
      </div>
    </div>`;
    })
    .join('\n');

  const incItems = (pkg.inclusions || [])
    .map(
      (i) =>
        `<div class="inclusion-item"><span class="text-green-500 font-bold mt-0.5">&#10003;</span><span>${h(i)}</span></div>`
    )
    .join('\n            ');

  const excItems = (pkg.exclusions || [])
    .map(
      (e) =>
        `<div class="inclusion-item"><span class="text-red-400 font-bold mt-0.5">&#10005;</span><span>${h(e)}</span></div>`
    )
    .join('\n            ');

  const installRows = (pkg.installments || [])
    .map(
      (inst) =>
        `<tr><td class="font-semibold">${h(inst.name)}</td><td>&#x20B9;${h(inst.amount)}/-</td><td class="text-orange font-semibold">${h(inst.dueBy)}</td></tr>`
    )
    .join('\n                ');

  const cancelRows = (pkg.cancellation || [])
    .map(
      (row) =>
        `<tr><td>${h(row.deadline)}</td><td class="font-semibold text-red-600">${h(row.deduction)}</td></tr>`
    )
    .join('\n                ');

  const notesHtml = (pkg.notes || [])
    .map(
      (n) => `<li class="flex gap-2"><span class="text-orange flex-shrink-0">•</span>${h(n)}</li>`
    )
    .join('\n            ');

  const travelCards = pkg.travel
    ? [
        `<div class="bg-light-gray rounded-lg p-4"><p class="text-xs text-muted mb-1">Departure Point</p><p class="font-poppins font-semibold text-navy text-sm">${h(pkg.travel.departure)}</p></div>`,
        `<div class="bg-light-gray rounded-lg p-4"><p class="text-xs text-muted mb-1">Travel Mode</p><p class="font-poppins font-semibold text-navy text-sm">${h(pkg.travel.train || pkg.travel.mode || '')}</p></div>`,
        `<div class="bg-light-gray rounded-lg p-4"><p class="text-xs text-muted mb-1">Return</p><p class="font-poppins font-semibold text-navy text-sm">${h(pkg.travel.arrival)}</p></div>`
      ].join('')
    : '';

  const waBase = 'https://wa.me/919076068549?text=';
  const waBook = encodeURIComponent(
    'Hi Samyati Holidays! I am interested in ' +
      pkg.title +
      '. Please share details and booking process.'
  );
  const waQuestion = encodeURIComponent(
    'Hi Samyati Holidays! I have a question about ' + pkg.title + '. Can you help?'
  );
  const waGeneral = encodeURIComponent(
    'Hi Samyati Holidays! I would like to know more about your tour packages.'
  );

  const allMap = new Map((allPkgs || []).map((p) => [p.slug, p]));
  let related = (pkg.related || [])
    .map((slug) => allMap.get(slug))
    .filter((p) => p && p.slug !== pkg.slug);
  if (related.length < 3) {
    const fallback = (allPkgs || [])
      .filter((p) => p.slug !== pkg.slug && !related.includes(p))
      .slice(0, 3 - related.length);
    related = related.concat(fallback);
  }
  related = related.slice(0, 3);
  const relatedCards = related
    .map((rp) => {
      const rImg = (rp.gallery && rp.gallery[0]) || rp.hero || '';
      const rCat = rp.category && rp.category[0] ? catLabels[rp.category[0]] || 'Nature' : 'Nature';
      return `<div class="related-card"><div class="relative"><img loading="lazy" decoding="async" src="${h(rImg)}" alt="${h(rp.title)}" class="w-full h-48 object-cover"/><span class="absolute top-3 left-3 bg-navy text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">${h(rCat)}</span></div><div class="p-5"><h3 class="font-poppins font-bold text-navy text-lg mb-2">${h(rp.title)}</h3><div class="flex gap-2 mb-3"><span class="chip">${h(rp.duration)}</span><span class="chip">${h(rp.dates)}</span></div><p class="font-poppins font-bold text-orange text-xl mb-3">${h(rp.priceLabel)}</p><div class="flex gap-2"><a href="${rp.slug}.html" class="btn-navy flex-1 text-sm py-2">View Details</a><a href="${waBase}${encodeURIComponent('Hi Samyati Holidays! I am interested in ' + rp.title + '. Please share details.')}" target="_blank" class="btn-orange flex-1 text-sm py-2">WhatsApp Now</a></div></div></div>`;
    })
    .join('\n      ');

  // Build template variables map
  const vars = {
    PAGE_TITLE: h(pkg.title),
    META_DESCRIPTION: h(
      pkg.subtitle ||
        pkg.title +
          ' - Fixed departure group tour from Mumbai and Pune by Samyati Holidays. ' +
          (pkg.duration || '') +
          ', ' +
          (pkg.dates || '') +
          '. Starting Rs.' +
          pkg.priceLabel +
          '/- per person.'
    ),
    HERO_IMAGE: h(pkg.hero || ''),
    HERO_ALT: h(pkg.title),
    PRICE_LABEL: h(pkg.priceLabel || '0'),
    PRICE_NOTE: h(pkg.priceNote || 'per person'),
    DURATION: h(pkg.duration || ''),
    DATES: h(pkg.dates || ''),
    DEPARTURE_CITY: h(pkg.departure || 'Mumbai'),
    TRANSPORT_LABEL: h(pkg.transport || 'Train'),
    TRANSPORT_ICON: transportIcon,
    WA_LINK_GENERAL: waBase + waGeneral,
    WA_LINK_BOOK: waBase + waBook,
    WA_LINK_QUESTION: waBase + waQuestion,
    CATEGORY_BADGES: cats,
    TRANSPORT_BADGE: pkg.transport
      ? `<span class="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">${h(pkg.transport)}</span>`
      : '',
    OVERVIEW_SECTION: pkg.subtitle
      ? `<div><p class="section-eyebrow">Package Overview</p><h2 class="section-title text-2xl md:text-3xl mt-1 mb-4">${h(pkg.subtitle)}</h2>${pkg.overview ? `<p class="text-gray-600 leading-relaxed mb-4">${h(pkg.overview)}</p>` : ''}</div>`
      : '',
    HIGHLIGHTS_SECTION:
      (pkg.highlights || []).length > 0
        ? `<div><div class="section-pin-divider mb-6"><div class="pin-icon"></div><div class="line"></div><span class="section-eyebrow">Trip Highlights</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-3">${(
            pkg.highlights || []
          )
            .map(
              (hl) =>
                `<div class="flex items-center gap-3 p-4 bg-light-gray rounded-lg"><span class="text-orange text-base flex-shrink-0 leading-none">&#9733;</span><span class="text-sm">${h(hl)}</span></div>`
            )
            .join('\n          ')}</div></div>`
        : '',
    ITINERARY_ITEMS: itinerary,
    INCLUSION_ITEMS: incItems,
    EXCLUSION_ITEMS: excItems,
    ADVISORY_BLOCK: pkg.advisory
      ? `<div class="bg-orange/10 border-l-4 border-orange rounded-r-xl p-4"><div class="flex gap-3 items-start"><svg class="w-5 h-5 text-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg><div><p class="font-poppins font-semibold text-navy text-sm mb-1">Important Advisory</p><p class="text-gray-700 text-sm">${h(pkg.advisory)}</p></div></div></div>`
      : '',
    TRAVEL_SECTION: pkg.travel
      ? `<div><p class="section-eyebrow">Travel Details</p><h2 class="section-title text-2xl mt-1 mb-6">Travel Details</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-4">${travelCards}</div></div>`
      : '',
    PAYMENT_SECTION:
      (pkg.installments || []).length > 0
        ? `<section class="reveal mb-10"><div class="section-pin-divider mb-6"><div class="pin-icon"></div><div class="line"></div><span class="section-eyebrow">Payment Schedule</span></div><div class="overflow-x-auto rounded-xl border border-gray-200"><table class="pricing-table"><thead><tr><th>Installment</th><th>Amount</th><th>Due By</th></tr></thead><tbody>${installRows}</tbody></table></div></section>`
        : '',
    CANCELLATION_SECTION:
      (pkg.cancellation || []).length > 0
        ? `<section class="reveal mb-10"><div class="section-pin-divider mb-6"><div class="pin-icon"></div><div class="line"></div><span class="section-eyebrow">Refund &amp; Cancellation Policy</span></div><div class="overflow-x-auto rounded-xl border border-gray-200"><table class="pricing-table"><thead><tr><th>Cancellation Date</th><th>Amount Deducted</th></tr></thead><tbody>${cancelRows}</tbody></table></div><p class="text-xs text-gray-500 mt-3">* First installment is non-refundable in all cases.</p></section>`
        : '',
    NOTES_SECTION:
      (pkg.notes || []).length > 0
        ? `<div><div class="section-pin-divider mb-4"><div class="pin-icon"></div><div class="line"></div><span class="section-eyebrow">Points to Note</span></div><div class="bg-gray-50 rounded-xl p-5"><ul class="space-y-2 text-sm text-gray-700">${notesHtml}</ul></div></div>`
        : '',
    RELATED_SECTION:
      related.length > 0
        ? `<section class="reveal py-12 bg-light-gray"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 class="font-poppins font-bold text-navy text-2xl mb-8">You Might Also Like</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-6">${relatedCards}</div></div></section>`
        : ''
  };

  let html = fs.readFileSync(TEMPLATE, 'utf8');

  // Replace each {{ VARIABLE }} with its computed value
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp('\\{\\{\\s*' + key + '\\s*\\}\\}', 'g');
    html = html.replace(regex, value);
  }

  // Substitute header/footer partials (template uses <!-- PARTIAL_HEADER / FOOTER --> markers)
  const ctx = {
    page: 'packages',
    waLink: waBase + waGeneral
  };
  const headerHtml = resolvePartialTokens(loadPartial('header'), ctx);
  const footerHtml = resolvePartialTokens(loadPartial('footer'), ctx);
  html = html.replace('<!-- PARTIAL_HEADER -->', headerHtml);
  html = html.replace('<!-- PARTIAL_FOOTER -->', footerHtml);

  // Clean up any remaining {{ ... }} (shouldn't be any)
  html = html.replace(/\{\{.*?\}\}/g, 'MISSING');

  return html;
}

// ── main ──────────────────────────────────────────────────────────────

const packages = loadPackages();
const validPackages = packages.filter((p) => p.slug && p.title);

if (validPackages.length === 0) {
  console.error('No valid packages found');
  process.exit(1);
}

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

// Copy static assets
const staticDirs = ['assets', 'css', 'js', 'images', '_partials'];
for (const dir of staticDirs) {
  const srcDir = path.join(ROOT, dir);
  const dstDir = path.join(DIST, dir);
  if (fs.existsSync(srcDir)) {
    if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
    copyDirSync(srcDir, dstDir);
  }
}

// Copy root files that should be served as-is
const rootFiles = [
  'about.html',
  'contact.html',
  'index.html',
  'netlify.toml',
  'packages.html',
  'package-detail.html',
  '_redirects'
];
for (const file of rootFiles) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, file));
  }
}

// Render each package page
let errors = 0;
const allPackages = [];
for (const pkg of validPackages) {
  try {
    const html = renderPackage(pkg, validPackages);
    const outFile = path.join(DIST, pkg.slug + '.html');
    fs.writeFileSync(outFile, html);
    allPackages.push(pkg);
    const size = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
    console.log(`  ${pkg.slug}.html (${size} KB)`);
  } catch (err) {
    console.error(`  ERROR ${pkg.slug}: ${err.message}`);
    errors++;
  }
}

// Regenerate packages.json from individual data files
fs.writeFileSync(path.join(DIST, 'packages.json'), JSON.stringify(allPackages, null, 2));
fs.writeFileSync(path.join(ROOT, 'packages.json'), JSON.stringify(allPackages, null, 2));
console.log(`  packages.json regenerated (${allPackages.length} packages)`);

// Sync js/packages-data.js for browser-side rendering
const jsExport =
  '// Auto-generated mirror of packages.json - DO NOT EDIT DIRECTLY\n' +
  '// Edit packages/*.json and run `node build.js` to regenerate\n' +
  'const SAMYATI_PACKAGES = ' +
  JSON.stringify(allPackages, null, 2) +
  ';\n\n' +
  "if (typeof module !== 'undefined' && module.exports) {\n" +
  '  module.exports = SAMYATI_PACKAGES;\n' +
  '}\n';
fs.writeFileSync(path.join(ROOT, 'js', 'packages-data.js'), jsExport);
console.log(`  js/packages-data.js synced`);

// Copy generated package pages back to root for local preview and git tracking
for (const pkg of validPackages) {
  const src = path.join(DIST, pkg.slug + '.html');
  const dst = path.join(ROOT, pkg.slug + '.html');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
  }
}
console.log(`  Generated pages synced to root`);

// Copy template reference
fs.writeFileSync(
  path.join(DIST, 'BUILD_INFO.txt'),
  `Built ${validPackages.length} package pages on ${new Date().toISOString()}\n` +
    `Template: template.html\n` +
    `Source: packages.json\n` +
    `Output: dist/\n` +
    `Static assets: css/, js/, images/\n`
);

console.log(
  `\nDone: ${validPackages.length} pages built${errors > 0 ? ` (${errors} errors)` : ''} -> dist/`
);

function copyDirSync(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}
