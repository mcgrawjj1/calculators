# CalcHub — Claude Project Context

## Project Overview
CalcHub is a static web application hosting practical calculators for everyday decisions.
Built with **vanilla HTML, CSS, and JavaScript** — no build tools, no frameworks, no dependencies.
Designed to be hosted on GitHub Pages.

## Owner
- GitHub: **mcgrawjj1**
- Repo: `https://github.com/mcgrawjj1/calculators`
- Remote: `git@github.com:mcgrawjj1/calculators.git` (SSH)

## Documentation Maintenance Rules — MANDATORY

**Every time any change is made to this project, Claude MUST update the following files before committing:**

### README.md
- If a new calculator is added → add a full entry under the [Calculators](#calculators) section documenting all inputs, outputs, formula, and behavior
- If a new section is added → add it to the Table of Contents and create its heading section
- If any design token, color, or spacing value changes → update the Design System table
- If the file structure changes → update the Project Structure tree and table
- If the roadmap changes → check/uncheck items in the Roadmap section
- If deployment or setup steps change → update Getting Started / Deployment sections

### CHANGELOG.md
- Every change — no matter how small — gets an entry under `[Unreleased]`
- Use these categories: `Added`, `Changed`, `Fixed`, `Removed`, `Security`
- When a version is formally released (tagged), move `[Unreleased]` items into a new `[X.Y.Z] — YYYY-MM-DD` section
- Follow Semantic Versioning:
  - PATCH (x.x.**1**) — bug fixes, style tweaks, copy edits, documentation only
  - MINOR (x.**1**.0) — new calculator or new section added
  - MAJOR (**2**.0.0) — breaking redesign or major structural overhaul

## Design System
- **Accent color:** Green — `#16A34A` (green-600)
- **Brand light:** `#F0FDF4` (green-50), `#DCFCE7` (green-100), `#BBF7D0` (green-200)
- **Text:** `#0F172A` (heading), `#64748B` (secondary), `#94A3B8` (muted)
- **Border:** `#E2E8F0`
- **Surface:** `#F8FAFC` (card backgrounds)
- **Font:** Inter (Google Fonts) — weights 300/400/500/600/700
- **Border radius:** Cards `20px`, Inputs `10px`, Small elements `6px`
- **Shadow:** Subtle, 7–8% opacity blacks
- **Style:** Minimalist, clean, functional — no gradients, no heavy decoration

## File Structure
```
calculators/
├── CLAUDE.md          ← This file (project context for Claude)
├── README.md          ← Human-readable project documentation (KEEP UPDATED)
├── CHANGELOG.md       ← Version history, every change logged here (KEEP UPDATED)
├── index.html         ← Single-page app, all sections
├── .gitignore
├── css/
│   └── style.css      ← Global styles, CSS custom properties design tokens
└── js/
    ├── car-payment.js ← Car payment calculator
    └── ...            ← Future calculators get their own files
```

## Page Structure
- **Sticky header** with logo + section navigation
- **Sections** each have an `id` that nav links scroll to
- **Calculator cards** use `.calc-layout` (2-col: inputs left, results right)
- Results panel has a green-50 background to visually distinguish from inputs

## Adding a New Calculator
1. Add `<article class="calc-card">` in the correct `<section>` in `index.html`
2. Follow the `.calc-layout` two-column pattern (inputs left, results right)
3. Add a new JS file in `js/` and reference with `<script src="js/...">` before `</body>`
4. If it's a new section, add a `<section id="...">` and a nav `<a href="#...">` link
5. **Update README.md** — add full calculator documentation under the Calculators section
6. **Update CHANGELOG.md** — add `Added` entry under `[Unreleased]`
7. **Update roadmap** in both README.md and CLAUDE.md (check the box)

## Calculator: Car Payment (`js/car-payment.js`)
**Inputs:** Vehicle Price, Down Payment, Trade-in Value, Sales Tax %, APR %, Loan Term (buttons)
**Formula:** Standard amortization — `M = P·r(1+r)^n / [(1+r)^n - 1]`
**Tax logic:** Tax applies to `(price - tradeIn)`; tax amount is rolled into the financed principal
**Outputs:** Monthly Payment (primary), Loan Amount, Total Interest, Total Cost, visual principal/interest bar
**Behavior:** Recalculates live on every input change; default values show on load

## Planned Roadmap
### Finance
- [x] Car Payment
- [ ] Mortgage (with full amortization table + extra payments)
- [ ] Savings Goal / Future Value
- [ ] Loan Comparison (side-by-side)

### Unit Conversions
- [ ] Length, Weight, Temperature, Volume

### Currency
- [ ] Live exchange rates (requires free API key)

## GitHub Pages Deployment
- Push `main` branch to `https://github.com/mcgrawjj1/calculators`
- Enable Pages: Settings → Pages → Branch: `main`, folder: `/ (root)`
- Site will be live at `https://mcgrawjj1.github.io/calculators`
