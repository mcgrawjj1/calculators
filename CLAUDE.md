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
├── index.html         ← Hub page — lists all calculators by category with links
├── auto-loan.html     ← Dedicated Auto Loan calculator page
├── mortgage.html      ← Dedicated Mortgage calculator page
├── .gitignore
├── css/
│   └── style.css      ← Global styles, CSS custom properties design tokens
└── js/
    ├── utils.js       ← Shared formatters (fmtCurrency, fmtCurrencyRounded) — load first
    ├── car-payment.js ← Car Payment tab (forward amortization)
    ├── max-budget.js  ← Monthly Payment tab (reverse amortization) + tab switching
    ├── mortgage.js    ← Mortgage calculator + amortization table
    ├── roth-ira.js    ← Roth vs. Traditional IRA comparison + year-by-year projection
    ├── fire-number.js ← FIRE Number calculator + year-by-year projection
    └── ...            ← Future calculators get their own files
```

## Page Architecture
- **`index.html`** is the hub/landing page — it lists calculators as clickable cards, grouped by section. No calculator logic runs here.
- **Each calculator** gets its own HTML file (e.g. `auto-loan.html`, `mortgage.html`). The file includes only the JS it needs.
- **`js/utils.js`** must be the first `<script>` on every calculator page — it defines the shared `fmtCurrency` and `fmtCurrencyRounded` constants that all calculator scripts depend on.
- Calculator pages use `.page-hero` + `.breadcrumb` below the header to show context and a back path to the hub.

## Page Structure
- **Sticky header** with logo + section navigation
- **Sections** each have an `id` that nav links scroll to
- **Calculator cards** use `.calc-layout` (2-col: inputs left, results right)
- Results panel has a green-50 background to visually distinguish from inputs

## Mobile Responsiveness — MANDATORY
Every calculator and every section of this site **must be fully responsive**. The three breakpoints in `css/style.css` are the standard — all new UI must be verified against each:

| Breakpoint | Target devices | Required behavior |
|---|---|---|
| `≤ 800px` | Tablets, large phones landscape | `.calc-layout` stacks to 1-col; reduce hero/section padding |
| `≤ 600px` | Phones (390px–600px) | Headings and result numbers scale down; side-by-side fields stack; nav condenses |
| `≤ 440px` | Small phones (360px–440px) | Card padding tightens; tabs, header, and result numbers fit without overflow |

**Rules:**
- Never add a new calculator layout without checking it at all three breakpoints
- New multi-column field groups (`.field-row`) automatically stack at ≤ 600px — use `.field-row` for any paired inputs
- New result numbers (`.result-amount`) inherit scaling — verify they don't overflow at 360px
- If new UI elements need breakpoint-specific rules, add them inside the existing `@media` blocks in `css/style.css` (do not create new breakpoint values)

## Adding a New Calculator
1. Add `<article class="calc-card">` in the correct `<section>` in `index.html`
2. Follow the `.calc-layout` two-column pattern (inputs left, results right)
3. Add a new JS file in `js/` and reference with `<script src="js/...">` before `</body>`
4. If it's a new section, add a `<section id="...">` and a nav `<a href="#...">` link
5. **Verify mobile responsiveness** at all three breakpoints (800px, 600px, 440px) — see Mobile Responsiveness section above
6. **Update README.md** — add full calculator documentation under the Calculators section
7. **Update CHANGELOG.md** — add `Added` entry under `[Unreleased]`
8. **Update roadmap** in both README.md and CLAUDE.md (check the box)

## Calculator: Mortgage (`js/mortgage.js`)
**Inputs:** Home Price, Down Payment (% or $ toggle), Loan Term (10/15/20/25/30 yr buttons), Interest Rate (APR), Start Month/Year, Property Tax (% or $ toggle), Home Insurance ($, annual), PMI ($, annual), HOA Fee ($, monthly), Other Costs ($, annual), Extra Monthly, Extra Yearly, One-time lump sum + at month #
**Formula:** Standard amortization — `M = P·r(1+r)^n / [(1+r)^n − 1]`; extra payments reduce balance each month
**Outputs:** Monthly P&I (primary), total monthly with costs (secondary, hidden when no costs), breakdown table (Monthly + Total per line item), principal/interest bar, 6 summary stats (Home Price, Down Payment, Loan Amount, Total Payments, Total Interest, Payoff Date)
**Amortization table:** Full-width below the calculator; Annual view (grouped by calendar year) and Monthly view (one row per month); rows injected by JS
**Behavior:** Live recalculation on every input; Taxes & Costs section collapses/expands; Extra Payments section collapsed by default; % / $ mode toggles convert existing values to new unit

## Calculator: Car Payment (`js/car-payment.js`)
**Inputs:** Vehicle Price, Down Payment, Trade-in Value, Sales Tax %, APR %, Loan Term (buttons)
**Formula:** Standard amortization — `M = P·r(1+r)^n / [(1+r)^n - 1]`
**Tax logic:** Tax applies to `(price - tradeIn)`; tax amount is rolled into the financed principal
**Outputs:** Monthly Payment (primary), Loan Amount, Total Interest, Total Cost, visual principal/interest bar
**Behavior:** Recalculates live on every input change; default values show on load

## Calculator: Roth vs. Traditional IRA (`js/roth-ira.js`)
**Inputs:** Annual Contribution ($), Current Age, Retirement Age, Annual Return (%), Current Marginal Tax Rate (%), Expected Retirement Tax Rate (%), Starting Balance ($)
**Formula:** Equal pre-tax cost comparison — Traditional: full $C/yr invested, taxed at retirementRate on withdrawal; Roth: $C×(1−currentRate)/yr invested, grows tax-free. Winner determined by which after-tax value is larger (simplifies to: currentRate vs retirementRate comparison)
**Outputs:** Traditional Balance (pre-tax), Traditional After-Tax Value, Roth Balance, winner callout, tax-drag bar, year-by-year projection table (Year, Age, Trad Balance, Roth Balance, Roth Advantage)
**CSS additions:** `.result-comparison` 2-col grid, `.result-account`, `.result-account--winner`, `.result-winner` callout
**Behavior:** Recalculates live on every input; winner card highlighted green; negative Roth Advantage shown in orange

## Calculator: FIRE Number (`js/fire-number.js`)
**Inputs:** Annual Spending in Retirement ($), Safe Withdrawal Rate (%, default 4%), Annual Return (%), Current Savings ($), Annual Savings Contribution ($), Current Age
**Formula:** FIRE Number = Annual Spending / SWR; iterate year-by-year: balance = balance×(1+r) + annualContrib until balance ≥ FIRE Number (cap at 100 years)
**Outputs:** FIRE Number (primary, large), Years to FIRE, Age at FIRE, Current Progress %, Monthly Savings implied; progress bar; year-by-year table (Year, Age, Balance, Annual Contribution, Progress %)
**CSS additions:** `.fire-progress-bar`, `.fire-progress-fill`, `.fire-row` highlight (green background on target row)
**Behavior:** Recalculates live on every input; FIRE row in table highlighted green; 100+ years shown if target unreachable

## Planned Roadmap
### Finance
- [x] Car Payment
- [x] Monthly Payment / Max Budget (reverse auto loan — Tab 2 of Auto Loan card)
- [x] Mortgage (with full amortization table + extra payments)
- [x] Roth vs. Traditional IRA (year-by-year comparison, winner callout)
- [x] FIRE Number (target portfolio, years to FIRE, year-by-year projection)
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
