# CalcHub

A collection of practical, clean calculators for everyday decisions. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

**Live site:** [mcgrawjj1.github.io/calculators](https://mcgrawjj1.github.io/calculators)
**Repository:** [github.com/mcgrawjj1/calculators](https://github.com/mcgrawjj1/calculators)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Design System](#design-system)
6. [Calculators](#calculators)
   - [Car Payment](#car-payment-calculator)
   - [Mortgage](#mortgage-calculator)
   - [Roth vs. Traditional IRA](#roth-vs-traditional-ira-calculator)
   - [FIRE Number](#fire-number-calculator)
7. [How to Add a New Calculator](#how-to-add-a-new-calculator)
8. [Deployment](#deployment)
9. [Roadmap](#roadmap)

---

## Project Overview

CalcHub is a multi-page static web application that hosts a growing library of useful calculators organized into sections (Finance, Unit Conversion, Currency, etc.). The hub page (`index.html`) lists all available calculators by category; clicking a card opens that calculator's own dedicated page. The goal is a fast, distraction-free tool that works well on any device and is simple enough that any future changes can be made without a build system.

**Design philosophy:** Minimalist and functional. No animations for their own sake, no heavy frameworks, no unnecessary complexity. The design serves the math.

---

## Features

- **Live calculation** — results update on every keystroke, no submit button needed
- **Responsive layout** — two-column on desktop, single-column on mobile
- **Accessible markup** — semantic HTML5, `aria-label`, `aria-live` regions for screen readers
- **No dependencies** — loads fast, works offline after first visit (no npm, no bundler)
- **Sticky frosted-glass header** — navigation always visible while scrolling
- **Multi-page architecture** — each calculator lives on its own dedicated page; the hub links them together
- **Extensible architecture** — adding a new calculator means creating one HTML page and one JS file

---

## Getting Started

### View locally

Open the file directly in your browser — no server needed:

```bash
open "/Users/mini/Library/Mobile Documents/com~apple~CloudDocs/Documents/Claude/calculators/index.html"
```

Or right-click `index.html` in Finder → Open With → your browser.

### Clone and run

```bash
git clone https://github.com/mcgrawjj1/calculators.git
cd calculators
open index.html
```

No `npm install`, no build step. It just works.

---

## Project Structure

```
calculators/
│
├── index.html              # Hub page — Finance cards linking to calculator pages
├── auto-loan.html          # Auto Loan dedicated page (Car Payment + Monthly Payment tabs)
├── mortgage.html           # Mortgage dedicated page (full calculator + amortization table)
├── roth-ira.html           # Roth vs. Traditional IRA comparison page
├── fire-number.html        # FIRE Number calculator page
│
├── css/
│   └── style.css           # All styles; design tokens defined as CSS custom properties
│                             at the top of the file under :root { }
│
├── js/
│   └── utils.js            # Shared formatters (fmtCurrency, fmtCurrencyRounded) — load first
│   └── car-payment.js      # Car Payment tab: forward amortization
│   └── max-budget.js       # Monthly Payment tab: reverse amortization + tab switching
│   └── mortgage.js         # Mortgage: payment, costs, extra payments, amortization table
│   └── roth-ira.js         # Roth vs. Traditional IRA: year-by-year projection + comparison
│   └── fire-number.js      # FIRE Number: target calculation + year-by-year projection
│   └── ...                 # Future calculators each get their own file
│
├── README.md               # This file — human-readable project documentation
├── CHANGELOG.md            # Version history — every release documented here
├── CLAUDE.md               # Context file for Claude AI sessions
└── .gitignore              # Ignores .DS_Store, editor files, logs
```

### Page architecture

The site uses a **hub-and-spoke** model:

| Page | Role |
|---|---|
| `index.html` | Hub — displays all calculator categories; each calculator shown as a clickable card that links to its own page. No calculator logic here. |
| `auto-loan.html` | Dedicated Auto Loan page — loads `utils.js`, `car-payment.js`, `max-budget.js` |
| `mortgage.html` | Dedicated Mortgage page — loads `utils.js`, `mortgage.js` |

Each calculator page includes:
- The shared header and footer
- A breadcrumb trail (Home / Finance / Calculator Name) and page title in `.page-hero`
- Only the scripts it needs (utils.js always loaded first)

### Key file roles

| File | Purpose |
|---|---|
| `index.html` | Hub page. Shows Finance section with card links. No scripts. |
| `auto-loan.html` | Auto Loan calculator page (both tabs). |
| `mortgage.html` | Mortgage calculator page (full calculator + amortization table). |
| `roth-ira.html` | Roth vs. Traditional IRA comparison page (year-by-year table). |
| `fire-number.html` | FIRE Number calculator page (target + year-by-year projection). |
| `css/style.css` | Every style rule. CSS custom properties at top act as the design token system. |
| `js/utils.js` | Shared currency formatters — must be loaded before any calculator script. |
| `js/car-payment.js` | Car Payment tab: reads inputs, runs forward amortization, writes to DOM. |
| `js/max-budget.js` | Monthly Payment tab: tab switching logic + reverse amortization. |
| `js/mortgage.js` | Mortgage: payment, optional costs, extra payments, amortization table. |
| `js/roth-ira.js` | Roth vs. Traditional IRA: year-by-year balance projection, winner callout. |
| `js/fire-number.js` | FIRE Number: target portfolio, years to FIRE, progress bar, year-by-year table. |
| `CLAUDE.md` | Instructions and context for Claude AI — keeps future sessions consistent. |
| `CHANGELOG.md` | Running record of every version and what changed. Updated with every release. |

---

## Design System

All design tokens are defined as CSS custom properties in the `:root` block at the top of `css/style.css`. Edit them there to retheme the entire site.

### Color palette

| Token | Value | Usage |
|---|---|---|
| `--brand` | `#16A34A` | Primary accent — buttons, amounts, underlines |
| `--brand-50` | `#F0FDF4` | Results panel background |
| `--brand-100` | `#DCFCE7` | Breakdown bar track, dividers |
| `--brand-200` | `#BBF7D0` | Breakdown bar track, table dividers |
| `--orange` | `#FB923C` | Interest portion of breakdown bar |
| `--brand-700` | `#15803D` | Total cost amount, result labels |
| `--white` | `#FFFFFF` | Page background, card background |
| `--gray-50` | `#F8FAFC` | Input field backgrounds |
| `--gray-200` | `#E2E8F0` | Borders |
| `--gray-500` | `#64748B` | Secondary text |
| `--gray-400` | `#94A3B8` | Muted/placeholder text |
| `--gray-900` | `#0F172A` | Primary text (headings, values) |

### Typography

- **Font family:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts), falling back to system sans-serif
- **Weights used:** 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Base size:** 15px body
- **Labels:** 11px, uppercase, letter-spacing 0.7px
- **Result amount:** 46px, weight 700, letter-spacing −2px

### Spacing & shape

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Term buttons, legend dots |
| `--radius` | `10px` | Input fields |
| `--radius-lg` | `16px` | (available, not yet used) |
| `--radius-xl` | `20px` | Calculator cards |
| `--radius-full` | `9999px` | Pill shapes, breakdown bar |

### Shadows

Kept intentionally subtle — 6–8% opacity so cards lift off the page without looking overdone.

| Token | Value |
|---|---|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)` |
| `--shadow` | `0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)` |

### Responsive breakpoints

| Breakpoint | Behavior |
|---|---|
| `> 800px` | Two-column calc layout (inputs left, results right) |
| `≤ 800px` | Single-column; results move below inputs |
| `≤ 600px` | Nav items trimmed; term buttons go 3-per-row; side-by-side field pairs stack |
| `≤ 440px` | Reduced padding for very small screens |

---

## Calculators

### Auto Loan (tabbed)

**Page:** `auto-loan.html`
**Section:** Finance
**Tabs:** Car Payment · Monthly Payment (reverse)
**Tab switching:** `js/max-budget.js` — `initTabs()` toggles `.active` on `.calc-tab` elements and `.is-active` on `.calc-panel` elements.

The Auto Loan page hosts two calculators in a tabbed layout. Both tabs share the same visual structure (inputs left, results right) but solve the loan equation in opposite directions.

---

#### Tab 1 — Car Payment Calculator

**File:** `js/car-payment.js`
**Panel ID:** `#car-payment-panel`

##### What it does

Given a vehicle price and financing terms, calculates the monthly payment. All results update live as the user types.

#### Inputs

| Field | ID | Type | Default | Notes |
|---|---|---|---|---|
| Vehicle Price | `vehicle-price` | number | 30,000 | Full sticker/purchase price |
| Down Payment | `down-payment` | number | 3,000 | Cash paid upfront |
| Trade-in Value | `trade-in` | number | 0 | Applied against price, also reduces taxable amount |
| Sales Tax Rate | `tax-rate` | number | 6.0% | State/local sales tax |
| Interest Rate (APR) | `apr` | number | 6.9% | Annual Percentage Rate |
| Loan Term | term buttons | button group | 60 mo (5 yr) | Options: 24, 36, 48, 60, 72, 84 months |

#### Outputs

| Field | ID | Format |
|---|---|---|
| Monthly Payment | `monthly-payment` | `$1,234.56` |
| Loan Amount | `loan-amount` | `$24,500` |
| Total Interest | `total-interest` | `$3,210` |
| Total Cost | `total-cost` | `$27,710` |
| Breakdown bar | `bar-principal` / `bar-interest` | Animated width % |

#### Formula

Standard loan amortization:

```
M = P × [r(1+r)^n] / [(1+r)^n − 1]
```

Where:
- `M` = monthly payment
- `P` = principal (financed amount)
- `r` = monthly interest rate = APR ÷ 12 ÷ 100
- `n` = number of monthly payments (loan term in months)

#### Tax logic

Sales tax applies to `(vehicle price − trade-in value)`. The down payment does not reduce the taxable amount. Tax is rolled into the financed principal, which is the most common real-world scenario.

```
taxable     = price − tradeIn
taxAmount   = taxable × (taxRate / 100)
principal   = price + taxAmount − down − tradeIn
```

#### Number formatting

All currency output uses the browser's built-in `Intl.NumberFormat`:

```javascript
// Two decimal places (monthly payment)
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Rounded (loan amount, interest, total)
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD',
  minimumFractionDigits: 0, maximumFractionDigits: 0 })
```

---

#### Tab 2 — Monthly Payment (Max Budget) Calculator

**File:** `js/max-budget.js`
**Panel ID:** `#max-budget-panel`

##### What it does

The reverse of Tab 1. Given a monthly payment the user is comfortable with, calculates the maximum vehicle price they can afford. All results update live.

##### Inputs

| Field | ID | Type | Default | Notes |
|---|---|---|---|---|
| Monthly Payment I Can Afford | `mb-monthly-payment` | number | 500 | Target payment ceiling |
| Down Payment | `mb-down-payment` | number | 3,000 | Cash paid upfront |
| Trade-in Value | `mb-trade-in` | number | 0 | Applied against price, reduces taxable amount |
| Sales Tax Rate | `mb-tax-rate` | number | 6.0% | State/local sales tax |
| Interest Rate (APR) | `mb-apr` | number | 6.9% | Annual Percentage Rate |
| Loan Term | `mb-term-btn` buttons | button group | 60 mo (5 yr) | Options: 24, 36, 48, 60, 72, 84 months |

##### Outputs

| Field | ID | Format |
|---|---|---|
| Max Vehicle Price | `mb-max-price` | `$32,000` |
| Loan Amount | `mb-loan-amount` | `$26,500` |
| Total Interest | `mb-total-interest` | `$3,800` |
| Total Cost | `mb-total-cost` | `$30,300` |
| Breakdown bar | `mb-bar-principal` / `mb-bar-interest` | Animated width % |

##### Formula

**Step 1** — Reverse the amortization formula to find the maximum principal:

```
P = M × [(1+r)^n − 1] / [r(1+r)^n]
```

Where `M` is the target monthly payment, `r` is the monthly rate, `n` is the term in months.

**Step 2** — Back-calculate the max vehicle price from the principal:

```
principal = (price − tradeIn)(1 + taxRate) − down
  ↓ solve for price:
price = (principal + down) / (1 + taxRate) + tradeIn
```

##### Tax logic

Same as Tab 1: tax applies to `(price − tradeIn)`, rolled into the financed principal. The algebra is inverted to solve for price instead.

---

---

### Mortgage Calculator

**Page:** `mortgage.html`
**Section:** Finance
**File:** `js/mortgage.js`

Calculates the monthly principal & interest payment for a home loan, optionally including property taxes, home insurance, PMI, HOA, and other costs. Supports extra payments (monthly, yearly, and one-time) that shorten the loan and reduce total interest. Displays a full amortization schedule (annual or monthly view) below the calculator.

#### Inputs

| Field | ID | Type | Default | Notes |
|---|---|---|---|---|
| Home Price | `mort-home-price` | number | $400,000 | Purchase price of the home |
| Down Payment | `mort-down-payment` | number | 20 | Percent or dollar; toggled with % / $ buttons |
| Loan Term | `.mort-term-btn` buttons | button group | 30 yr | Options: 10, 15, 20, 25, 30 years |
| Interest Rate (APR) | `mort-interest-rate` | number | 6.5% | Annual Percentage Rate |
| Loan Starts | `mort-start-month` / `mort-start-year` | select / number | Mar 2026 | Used to label amortization table and compute payoff date |
| Property Tax | `mort-prop-tax` | number | 1.2% | Annual; toggled between % of home price or flat $ |
| Home Insurance | `mort-home-ins` | number | $1,500 | Annual dollar amount |
| PMI | `mort-pmi` | number | $0 | Annual dollar amount; row hidden when $0 |
| HOA Fee | `mort-hoa` | number | $0 | Monthly dollar amount; row hidden when $0 |
| Other Costs | `mort-other` | number | $0 | Annual dollar amount; row hidden when $0 |
| Extra Monthly | `mort-extra-monthly` | number | $0 | Applied every month on top of the regular payment |
| Extra Yearly | `mort-extra-yearly` | number | $0 | Applied every 12th month (anniv. of loan start) |
| One-time Payment | `mort-extra-once` | number | $0 | Single lump sum applied at the specified month |
| At Month # | `mort-extra-once-mo` | number | 12 | Loan month number (1–360) when lump sum is applied |

#### Outputs

| Field | ID | Format |
|---|---|---|
| Monthly P&I Payment | `mort-monthly-pi` | `$2,528` |
| Total with Taxes & Costs | `mort-monthly-total` | `$3,253` (hidden when no costs) |
| Breakdown table | `mort-bd-*` | Monthly + Total columns per cost type |
| Principal / Interest bar | `mort-bar-principal` / `mort-bar-interest` | Animated width % |
| Home Price | `mort-out-home-price` | `$400,000.00` |
| Down Payment | `mort-out-down` | `$80,000.00` |
| Loan Amount | `mort-out-loan` | `$320,000.00` |
| Total Payments (P&I) | `mort-out-pi-total` | `$695,797.00` |
| Total Interest | `mort-out-interest` | `$375,797.00` |
| Payoff Date | `mort-out-payoff` | `Feb 2056` |
| Amortization schedule | `mort-amort-body` | Rows injected by JS; annual or monthly view |

#### Formula

Standard loan amortization:

```
M = P × [r(1+r)^n] / [(1+r)^n − 1]
```

Where `P` = loan principal, `r` = monthly rate (APR ÷ 12 ÷ 100), `n` = term in months.

#### Extra Payments

Extra payments are applied after the base principal/interest split each month. They directly reduce the outstanding balance, shortening the loan:

```
interest      = balance × r
principalPaid = M − interest + extraThisMonth
balance       = balance − principalPaid
```

The schedule loop exits when `balance ≤ 0` (before `n` months if extra payments are made), producing a shorter amortization table and earlier payoff date.

#### Cost Handling

- **Property Tax:** entered as % of home price or annual $ — converted to monthly by dividing by 12
- **Home Insurance / PMI / Other:** entered as annual $ — divided by 12
- **HOA Fee:** entered as monthly $ — used directly
- The breakdown table and "total with costs" line are hidden entirely when all optional costs are $0

#### Amortization Table

Rows are injected into `#mort-amort-body` by `renderAmortTable()`. Two views:

| View | First column | Row data |
|---|---|---|
| Annual (default) | Calendar year | Sum of principal paid, interest paid, total paid; ending balance |
| Monthly | "Mon YYYY" (e.g. "Mar 2026") | Per-month principal, interest, total, balance |

Calendar year is determined from the start month/year: row month `n` maps to `startYear + floor((startMonth − 1 + n − 1) / 12)`.

---

### Roth vs. Traditional IRA Calculator

**Page:** `roth-ira.html`
**Section:** Finance
**File:** `js/roth-ira.js`

Compares the after-tax retirement value of a Roth IRA vs. a Traditional IRA on an equal pre-tax cost basis, and shows a year-by-year balance projection for both accounts.

#### Inputs

| Field | ID | Type | Default | Notes |
|---|---|---|---|---|
| Annual Contribution | `roth-contribution` | number | $7,000 | Dollar amount contributed each year |
| Current Age | `roth-current-age` | number | 30 | Used to calculate number of investment years |
| Retirement Age | `roth-retire-age` | number | 65 | When withdrawals begin |
| Expected Annual Return | `roth-return` | number | 7% | Pre-tax nominal annual return |
| Current Marginal Tax Rate | `roth-current-tax` | number | 22% | Federal + state marginal rate today |
| Expected Retirement Tax Rate | `roth-retire-tax` | number | 15% | Effective rate applied to Traditional withdrawals |
| Starting Balance | `roth-starting-balance` | number | $0 | Existing IRA balance (optional) |

#### Outputs

| Field | ID | Format |
|---|---|---|
| Traditional Ending Balance | `roth-trad-balance` | `$542,000` (pre-tax) |
| Traditional After-Tax Value | `roth-trad-aftertax` | `$460,700` |
| Roth Ending Balance | `roth-roth-balance` | `$423,000` (all after-tax) |
| Winner Callout | `roth-winner` | Text — "Roth saves you $X,XXX more" or equivalent |
| Tax-drag bar | `bar-trad-kept` / `bar-trad-tax` | Animated width % |
| Year-by-year table | `roth-table-body` | Year, Age, Traditional Balance, Roth Balance, Roth Advantage |

#### Formula

Equal pre-tax cost comparison — Traditional receives the full contribution, Roth receives the after-tax equivalent:

```
years = retireAge − currentAge
r     = annualReturn / 100

Traditional balance = startBal*(1+r)^n + C*[(1+r)^n − 1]/r
Traditional after-tax = tradBalance * (1 − retirementTaxRate)

Roth contribution per year = C * (1 − currentTaxRate)
Roth balance = startBal*(1−currentTax)*(1+r)^n + C*(1−currentTax)*[(1+r)^n − 1]/r
(No withdrawal tax on Roth)
```

**Winner logic:** The account with the higher after-tax value wins. Mathematically: if `currentTaxRate < retirementTaxRate` → Roth wins; if `currentTaxRate > retirementTaxRate` → Traditional wins; if equal → tie.

#### Year-by-Year Table

Tracks both balances each year from year 1 to `retireAge − currentAge`. "Roth Advantage" column = Roth Balance − Traditional After-Tax Value. Positive = Roth is ahead; negative (shown in orange) = Traditional is ahead.

---

### FIRE Number Calculator

**Page:** `fire-number.html`
**Section:** Finance
**File:** `js/fire-number.js`

Calculates the portfolio size needed for financial independence using the safe withdrawal rate (SWR), then iterates year-by-year to show how long until current savings + contributions reach that target.

#### Inputs

| Field | ID | Type | Default | Notes |
|---|---|---|---|---|
| Annual Spending in Retirement | `fire-spending` | number | $60,000 | Estimated yearly expenses in retirement |
| Safe Withdrawal Rate | `fire-swr` | number | 4.0% | The "4% rule" from the Trinity Study |
| Annual Return | `fire-return` | number | 8% | Expected portfolio growth rate pre-FIRE |
| Current Savings | `fire-savings` | number | $50,000 | Current invested portfolio value |
| Annual Savings Contribution | `fire-contribution` | number | $24,000 | Amount added to the portfolio each year |
| Current Age | `fire-age` | number | 30 | Used to compute "Age at FIRE" |

#### Outputs

| Field | ID | Format |
|---|---|---|
| FIRE Number | `fire-number` | `$1,500,000` |
| Years to FIRE | `fire-years` | `22 yrs` or `100+ yrs` |
| Age at FIRE | `fire-age-at-fire` | `52` |
| Current Progress | `fire-progress-pct` | `3.3%` |
| Monthly Savings | `fire-monthly-savings` | `$2,000/mo` |
| Progress bar | `fire-progress-fill` | Animated width % |
| Year-by-year table | `fire-table-body` | Year, Age, Balance, Annual Contribution, Progress % |

#### Formula

```
FIRE Number = Annual Spending / (SWR / 100)

Year-by-year iteration (max 100 years):
  balance = balance × (1 + r) + annualContribution
  stop when balance ≥ FIRE Number

Years to FIRE = iteration count when balance first crosses target
Age at FIRE   = currentAge + yearsToFire
Progress %    = currentSavings / FIRE Number × 100
```

#### Year-by-Year Table

One row per year until the portfolio crosses the FIRE target. The final row (where the FIRE number is reached) is highlighted with a green background. If the target is not reached within 100 years, the table shows 100 rows and "100+ yrs" in the results.

---

## How to Add a New Calculator

Follow these steps to add a new calculator to an existing section (e.g., Finance), or add a whole new section.

### 1. Add a hub card in `index.html`

Inside the `.hub-grid` in the appropriate `<section>`, add a card that links to the new page:

```html
<a href="my-calculator.html" class="hub-card">
  <div class="hub-card-icon" aria-hidden="true">
    <!-- SVG icon here -->
  </div>
  <div class="hub-card-content">
    <h3>Calculator Name</h3>
    <p>One-line description of what it calculates</p>
  </div>
  <span class="hub-card-arrow" aria-hidden="true">→</span>
</a>
```

### 2. Create the dedicated calculator page

Create `my-calculator.html`. Use `auto-loan.html` or `mortgage.html` as a template. Key structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- meta, fonts, css/style.css -->
  <title>My Calculator — CalcHub</title>
</head>
<body>
  <!-- Shared header (logo href="index.html") -->
  <div class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span class="breadcrumb-sep" aria-hidden="true">/</span>
        <a href="index.html#finance">Finance</a>
        <span class="breadcrumb-sep" aria-hidden="true">/</span>
        <span>My Calculator</span>
      </nav>
      <h1 class="page-title">My Calculator</h1>
    </div>
  </div>

  <main>
    <section class="section">
      <div class="container">
        <div class="calc-grid">
          <article class="calc-card" id="my-calculator">
            <div class="calc-layout">
              <!-- INPUTS (left pane) -->
              <div class="calc-inputs">
                <div class="field">
                  <label for="my-input">Field Label</label>
                  <div class="input-group">
                    <span class="input-addon" aria-hidden="true">$</span>
                    <input type="number" id="my-input" value="0" min="0" step="1">
                  </div>
                </div>
              </div>
              <!-- RESULTS (right pane) -->
              <div class="calc-results" aria-live="polite">
                <div class="result-primary">
                  <div class="result-label">Primary Result</div>
                  <div class="result-amount" id="my-result">—</div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>

  <!-- Shared footer -->
  <script src="js/utils.js"></script>
  <script src="js/my-calculator.js"></script>
</body>
</html>
```

**Suffix input** (e.g., percentage): swap the `input-addon` to the right side and add the `--suffix` modifier:

```html
<div class="input-group">
  <input type="number" id="my-rate" value="5.0">
  <span class="input-addon input-addon--suffix" aria-hidden="true">%</span>
</div>
```

**Side-by-side fields:** wrap two `.field` elements in `.field-row`:

```html
<div class="field-row">
  <div class="field">...</div>
  <div class="field">...</div>
</div>
```

### 3. Create the JavaScript file

Create `js/my-calculator.js`. Always load `js/utils.js` first on the HTML page — it provides `fmtCurrency` and `fmtCurrencyRounded`. Follow this structure:

```javascript
'use strict';
// Note: fmtCurrency / fmtCurrencyRounded defined in js/utils.js (loaded first)

function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function calculate() {
  const input = getVal('my-input');
  // ... your formula here ...
  document.getElementById('my-result').textContent = fmtCurrency(result);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('my-input').addEventListener('input', calculate);
  calculate();
});
```

### 4. Add a new section (if needed)

If this calculator belongs to a new category (e.g., Unit Conversions):

**In `index.html`** — replace or convert the Coming Soon placeholder:

```html
<section id="unit-conversion" class="section">
  <div class="container">
    <div class="section-heading">
      <h2>Unit Conversion</h2>
      <p>Convert between common units of measurement</p>
    </div>
    <div class="hub-grid">
      <!-- hub cards go here -->
    </div>
  </div>
</section>
```

**In the `<nav>`** — update the dimmed link:

```html
<a href="index.html#unit-conversion" class="nav-link">Unit Conversion</a>
```

Remove the `nav-link--dim` class and `aria-disabled` attribute once the section is live.

### 5. Verify mobile responsiveness

Check the new page at all three breakpoints (800px, 600px, 440px). See the [responsive breakpoints table](#responsive-breakpoints) in the Design System section.

### 6. Update documentation

- Add the new calculator to `README.md` under [Calculators](#calculators)
- Add an entry to `CHANGELOG.md` under the `[Unreleased]` section
- Update the roadmap checkbox in both `README.md` and `CLAUDE.md`
- Update the file structure in `README.md` and `CLAUDE.md`

---

## Deployment

The site is deployed as a static site on **GitHub Pages** — free hosting directly from the repository.

### Setup (one-time)

1. Push the `main` branch to GitHub
2. Go to the repository on GitHub → **Settings** → **Pages**
3. Under "Build and deployment", set:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Click **Save**

GitHub will deploy automatically. The site will be live within a minute at:
```
https://mcgrawjj1.github.io/calculators
```

### Deploying updates

Every push to the `main` branch automatically redeploys the site. There is no build step.

```bash
git add -A
git commit -m "feat: add mortgage calculator"
git push
```

---

## Roadmap

### Finance
- [x] Car Payment
- [x] Monthly Payment / Max Budget (reverse auto loan)
- [x] Mortgage — monthly payment, full amortization table, extra payment scenarios
- [x] Roth vs. Traditional IRA — after-tax comparison with year-by-year projection
- [x] FIRE Number — financial independence target + years to retirement
- [ ] Savings Goal — how much to save monthly to reach a target
- [ ] Loan Comparison — compare two loans side by side

### Unit Conversion
- [ ] Length (in, ft, m, km, mi)
- [ ] Weight (lb, kg, oz, g)
- [ ] Temperature (°F, °C, K)
- [ ] Volume (fl oz, cups, liters, gallons)

### Currency
- [ ] Live exchange rates (requires free API key, e.g. exchangerate-api.com)
