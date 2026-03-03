'use strict';

// ============================================================
//  FIRE Number Calculator
//  Financial Independence, Retire Early
//
//  FIRE Number = Annual Spending in Retirement / Safe Withdrawal Rate
//  Default SWR = 4% (the "4% rule" from the Trinity Study)
//
//  Iterates year-by-year compounding savings + contributions
//  until the portfolio reaches the FIRE target.
// ============================================================

// ── Helpers ───────────────────────────────────────────────────────────────────
// Note: fmtCurrency and fmtCurrencyRounded are defined in js/utils.js (loaded first)

function gv(id)        { return parseFloat(document.getElementById(id).value) || 0; }
function sel(id)       { return document.getElementById(id); }
function set(id, txt)  { const e = sel(id); if (e) e.textContent = txt; }
function show(id, vis) { const e = sel(id); if (e) e.style.display = vis ? '' : 'none'; }

// ── State ─────────────────────────────────────────────────────────────────────
let fireSchedule = [];

// ── Core Calculation ──────────────────────────────────────────────────────────
function calculateFire() {
  const spending      = gv('fire-spending');
  const swr           = gv('fire-swr') / 100;
  const returnRate    = gv('fire-return') / 100;
  const savings       = gv('fire-savings');
  const annualContrib = gv('fire-contribution');
  const currentAge    = Math.floor(gv('fire-age'));

  if (spending <= 0 || swr <= 0) {
    renderResults(0, 0, 0, 0, 0);
    fireSchedule = [];
    renderTable([], 0);
    return;
  }

  const fireNumber  = spending / swr;
  const progressPct = savings >= fireNumber ? 100 : (fireNumber > 0 ? (savings / fireNumber) * 100 : 0);

  fireSchedule = buildSchedule(savings, annualContrib, returnRate, fireNumber, currentAge);

  const lastRow     = fireSchedule[fireSchedule.length - 1];
  const yearsToFire = lastRow && lastRow.balance >= fireNumber ? fireSchedule.length : null;
  const ageAtFire   = yearsToFire !== null ? currentAge + yearsToFire : null;

  renderResults(fireNumber, yearsToFire, ageAtFire, progressPct, annualContrib);
  renderTable(fireSchedule, fireNumber);
}

function buildSchedule(startSavings, annualContrib, r, fireNumber, currentAge) {
  const schedule = [];
  let balance    = startSavings;
  const maxYears = 100;

  for (let yr = 1; yr <= maxYears; yr++) {
    balance = balance * (1 + r) + annualContrib;
    const age     = currentAge + yr;
    const pct     = Math.min(balance / fireNumber * 100, 100);
    const reached = balance >= fireNumber;

    schedule.push({ year: yr, age, balance, annualContrib, progress: pct, reached });

    if (reached) break;
  }

  return schedule;
}

// ── DOM Update ────────────────────────────────────────────────────────────────
function renderResults(fireNumber, yearsToFire, ageAtFire, progressPct, annualContrib) {
  const empty = fireNumber === 0;

  set('fire-number', empty ? '—' : fmtCurrencyRounded(fireNumber));

  if (empty) {
    set('fire-years',          '—');
    set('fire-age-at-fire',    '—');
    set('fire-progress-pct',   '—');
    set('fire-monthly-savings','—');
  } else {
    set('fire-years',       yearsToFire !== null ? yearsToFire + ' yrs' : '100+ yrs');
    set('fire-age-at-fire', ageAtFire   !== null ? String(ageAtFire)    : '—');
    set('fire-progress-pct',   progressPct.toFixed(1) + '%');
    set('fire-monthly-savings', fmtCurrencyRounded(annualContrib / 12) + '/mo');
  }

  // Progress bar
  const fill = sel('fire-progress-fill');
  if (fill) fill.style.width = (empty ? 0 : progressPct) + '%';
}

function renderTable(schedule, fireNumber) {
  const tbody = sel('fire-table-body');
  if (!tbody) return;

  if (!schedule.length) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px 14px">' +
      'Enter valid inputs to see the year-by-year projection</td></tr>';
    return;
  }

  tbody.innerHTML = schedule.map(row => {
    const rowClass = row.reached ? ' class="fire-row"' : '';
    return (
      `<tr${rowClass}>` +
      `<td>${row.year}</td>` +
      `<td>${row.age}</td>` +
      `<td>${fmtCurrencyRounded(row.balance)}</td>` +
      `<td>${fmtCurrencyRounded(row.annualContrib)}</td>` +
      `<td>${row.progress.toFixed(1)}%</td>` +
      '</tr>'
    );
  }).join('');
}

// ── Init ──────────────────────────────────────────────────────────────────────
function initFire() {
  [
    'fire-spending', 'fire-swr', 'fire-return',
    'fire-savings', 'fire-contribution', 'fire-age'
  ].forEach(id => {
    const el = sel(id);
    if (el) el.addEventListener('input', calculateFire);
  });

  calculateFire();
}

document.addEventListener('DOMContentLoaded', initFire);
