# Changelog

All notable changes to CalcHub are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/):
- **MAJOR** — breaking redesign or incompatible structural change
- **MINOR** — new calculator or new section added
- **PATCH** — bug fix, style tweak, copy change, or documentation update

---

## [Unreleased]

_Changes staged here move to a versioned release when pushed/deployed._

---

## [1.0.0] — 2026-03-01

### Added

#### Project foundation
- `index.html` — single-page app shell with sticky frosted-glass header, hero tagline, main content area, and footer
- `css/style.css` — complete stylesheet using CSS custom properties as a design token system; fully responsive with breakpoints at 800px, 600px, and 440px
- `.gitignore` — ignores macOS `.DS_Store`, editor directories (`.vscode/`, `.idea/`), and log files
- Git repository initialized; remote configured to `git@github.com:mcgrawjj1/calculators.git`
- GitHub Pages deployment ready (push `main` branch; enable Pages in repo settings)

#### Design system
- Green accent palette: `--brand` (#16A34A) with 50/100/200/700 tints
- Neutral palette: gray-50 through gray-900 as CSS custom properties
- Inter typeface (Google Fonts), weights 300–700
- Border radius tokens: sm (6px), default (10px), lg (16px), xl (20px), full (9999px)
- Subtle shadow tokens: xs, sm, default
- Sticky header with `backdrop-filter: blur` frosted-glass effect
- Two-column calculator layout (`.calc-layout`): inputs left, results right with brand-50 background
- Responsive: collapses to single column at 800px

#### Finance section
- Section heading with animated green underline accent

#### Car Payment Calculator (`js/car-payment.js`)
- **Inputs:** Vehicle Price, Down Payment, Trade-in Value, Sales Tax %, APR %, Loan Term
- **Loan Term selector:** button group — 2 yr / 3 yr / 4 yr / 5 yr / 6 yr / 7 yr (24–84 months); defaults to 5 yr
- **Formula:** Standard loan amortization — `M = P·r(1+r)^n / [(1+r)^n − 1]`
- **Tax logic:** tax applies to `(price − tradeIn)`; rolled into financed principal
- **Outputs:** Monthly Payment (formatted to cents), Loan Amount, Total Interest, Total Cost (all formatted via `Intl.NumberFormat`)
- **Breakdown bar:** animated green/light-green bar showing principal vs. interest split
- Live recalculation on every input event
- Default values pre-filled (price $30,000 / down $3,000 / tax 6% / APR 6.9% / 60 mo) so calculator is immediately usable on load
- `aria-live="polite"` on results region for screen reader support

#### Documentation
- `README.md` — full project documentation: overview, design system reference, calculator documentation with formula and field descriptions, step-by-step guide for adding new calculators, deployment instructions, roadmap
- `CHANGELOG.md` — this file; version history going forward
- `CLAUDE.md` — AI session context: design system, file structure, conventions, documentation maintenance rules, roadmap

---

_[Unreleased]: https://github.com/mcgrawjj1/calculators/compare/v1.0.0...HEAD_
_[1.0.0]: https://github.com/mcgrawjj1/calculators/releases/tag/v1.0.0_
