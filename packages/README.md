# SSG Build System

This directory uses a template-based static site generator to produce
individual package HTML pages from shared template + per-package data files.

## How it works

```
template.html        ← ONE shared HTML template (~300 lines)
packages/*.json      ← ONE tiny data file per package
build.js             ← Runs the template renderer, outputs dist/*.html
```

## Adding a new package

1. Create `packages/new-package.json` with the package data
2. Run `node build.js`
3. Done — the HTML page is generated automatically
