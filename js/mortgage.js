'use strict';

// ── State ─────────────────────────────────────────────────────────────────────
let mortTerm      = 30;
let mortDpMode    = 'pct';    // 'pct' | 'dollar'
let mortTaxMode   = 'pct';    // 'pct' | 'dollar'
let mortAmortView = 'annual'; // 'annual' | 'monthly'
let mortSchedule  = [];       // cached full schedule for view switching

// Month abbreviations (used for payoff date and amort table labels)
const MORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                     'Jul','Aug','Sep','Oct','Nov','Dec'];

// ── Helpers ───────────────────────────────────────────────────────────────────
// Note: fmtCurrency and fmtCurrencyRounded are defined in js/utils.js (loaded first)

function mgv(id)        { return parseFloat(document.getElementById(id).value) || 0; }
function mel(id)        { return document.getElementById(id); }
function mset(id, txt)  { const e = mel(id); if (e) e.textContent = txt; }
function mshow(id, vis) { const e = mel(id); if (e) e.style.display = vis ? '' : 'none'; }

// Returns "Mar 2056" given loan month number, loan start month (1-12) and start year
function monthLabel(loanMonth, startMonth, startYear) {
  const offset = (startMonth - 1) + (loanMonth - 1);
  return MORT_MONTHS[offset % 12] + ' ' + (startYear + Math.floor(offset / 12));
}

// ── Core Calculation ──────────────────────────────────────────────────────────
function calculateMortgage() {
  const homePrice  = mgv('mort-home-price');
  const dpInput    = mgv('mort-down-payment');
  const annualRate = mgv('mort-interest-rate');
  const startMonth = parseInt(mel('mort-start-month').value) || 3;
  const startYear  = parseInt(mel('mort-start-year').value)  || 2026;
  const extraMo    = mgv('mort-extra-monthly');
  const extraYr    = mgv('mort-extra-yearly');
  const extraOnce  = mgv('mort-extra-once');
  const extraOnceMo = parseInt(mel('mort-extra-once-mo').value) || 12;

  // Down payment
  const downPayment = mortDpMode === 'pct'
    ? homePrice * (dpInput / 100)
    : dpInput;
  const principal = Math.max(homePrice - downPayment, 0);

  // Monthly rate and number of payments
  const monthlyRate = annualRate / 100 / 12;
  const n           = mortTerm * 12;

  // Standard amortization  M = P · r(1+r)^n / [(1+r)^n − 1]
  let monthlyPI;
  if (monthlyRate === 0 || principal === 0) {
    monthlyPI = n > 0 ? principal / n : 0;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    monthlyPI = principal * (monthlyRate * factor) / (factor - 1);
  }

  // Monthly cost components
  const propTaxInput = mgv('mort-prop-tax');
  const monthlyTax   = mortTaxMode === 'pct'
    ? (homePrice * propTaxInput / 100) / 12
    : propTaxInput / 12;
  const monthlyIns   = mgv('mort-home-ins') / 12;
  const monthlyPMI   = mgv('mort-pmi')      / 12;
  const monthlyHOA   = mgv('mort-hoa');          // already monthly
  const monthlyOther = mgv('mort-other')    / 12;
  const monthlyCosts = monthlyTax + monthlyIns + monthlyPMI + monthlyHOA + monthlyOther;
  const monthlyTotal = monthlyPI + monthlyCosts;

  // Build amortization schedule (accounts for extra payments)
  mortSchedule = buildSchedule(
    principal, monthlyRate, n, monthlyPI,
    extraMo, extraYr, extraOnce, extraOnceMo
  );

  const numMonths     = mortSchedule.length;
  const totalPrincipal = mortSchedule.reduce((s, r) => s + r.principal, 0);
  const totalInterest  = mortSchedule.reduce((s, r) => s + r.interest,  0);
  const totalPI        = totalPrincipal + totalInterest;
  const totalCosts     = monthlyCosts * numMonths;
  const totalOutOfPkt  = totalPI + totalCosts;
  const payoff         = numMonths > 0 ? monthLabel(numMonths, startMonth, startYear) : '—';

  // ── Primary result ──────────────────────────────────────────────────────────
  mset('mort-monthly-pi', fmtCurrencyRounded(monthlyPI));

  // Secondary line — only visible when there are extra costs
  if (monthlyCosts > 0) {
    mset('mort-monthly-total', fmtCurrencyRounded(monthlyTotal));
    mshow('mort-monthly-total-wrap', true);
  } else {
    mshow('mort-monthly-total-wrap', false);
  }

  // ── Breakdown table ─────────────────────────────────────────────────────────
  mset('mort-bd-pi-mo',    fmtCurrency(monthlyPI));
  mset('mort-bd-pi-tot',   fmtCurrency(totalPI));
  mset('mort-bd-tax-mo',   fmtCurrency(monthlyTax));
  mset('mort-bd-tax-tot',  fmtCurrency(monthlyTax   * numMonths));
  mset('mort-bd-ins-mo',   fmtCurrency(monthlyIns));
  mset('mort-bd-ins-tot',  fmtCurrency(monthlyIns   * numMonths));
  mset('mort-bd-pmi-mo',   fmtCurrency(monthlyPMI));
  mset('mort-bd-pmi-tot',  fmtCurrency(monthlyPMI   * numMonths));
  mset('mort-bd-hoa-mo',   fmtCurrency(monthlyHOA));
  mset('mort-bd-hoa-tot',  fmtCurrency(monthlyHOA   * numMonths));
  mset('mort-bd-other-mo', fmtCurrency(monthlyOther));
  mset('mort-bd-other-tot',fmtCurrency(monthlyOther * numMonths));
  mset('mort-bd-total-mo', fmtCurrency(monthlyTotal));
  mset('mort-bd-total-tot',fmtCurrency(totalOutOfPkt));

  // Show only rows with values; hide entire table when no costs entered
  mshow('mort-bd-tax-row',   monthlyTax   > 0);
  mshow('mort-bd-ins-row',   monthlyIns   > 0);
  mshow('mort-bd-pmi-row',   monthlyPMI   > 0);
  mshow('mort-bd-hoa-row',   monthlyHOA   > 0);
  mshow('mort-bd-other-row', monthlyOther > 0);
  mshow('mort-bd-section',   monthlyCosts > 0);

  // ── Principal / Interest bar ─────────────────────────────────────────────────
  const piPct = totalPI > 0 ? (totalPrincipal / totalPI * 100) : 50;
  const barP  = mel('mort-bar-principal');
  const barI  = mel('mort-bar-interest');
  if (barP) barP.style.width = piPct.toFixed(1) + '%';
  if (barI) barI.style.width = (100 - piPct).toFixed(1) + '%';

  // ── Summary stats ────────────────────────────────────────────────────────────
  mset('mort-out-home-price', fmtCurrency(homePrice));
  mset('mort-out-down',       fmtCurrency(downPayment));
  mset('mort-out-loan',       fmtCurrency(principal));
  mset('mort-out-pi-total',   fmtCurrency(totalPI));
  mset('mort-out-interest',   fmtCurrency(totalInterest));
  mset('mort-out-payoff',     payoff);

  // ── Amortization table ───────────────────────────────────────────────────────
  renderAmortTable(mortSchedule, startMonth, startYear, mortAmortView);
}

// ── Amortization Schedule Builder ─────────────────────────────────────────────
function buildSchedule(principal, monthlyRate, n, monthlyPI,
                       extraMo, extraYr, extraOnce, extraOnceAt) {
  let balance = principal;
  const rows  = [];
  let month   = 0;

  while (balance > 0.005 && month < n) {
    month++;
    const interest = balance * monthlyRate;

    // Accumulate any extra payments this month
    let extra = extraMo;
    if (month % 12 === 0) extra += extraYr;           // extra yearly on month 12, 24, …
    if (month === extraOnceAt) extra += extraOnce;     // one-time lump sum

    let principalPaid = monthlyPI - interest + extra;
    if (principalPaid > balance) principalPaid = balance;
    if (principalPaid < 0)       principalPaid = 0;

    balance = Math.max(0, balance - principalPaid);
    rows.push({ month, principal: principalPaid, interest, balance });
  }

  return rows;
}

// ── Render Amortization Table ──────────────────────────────────────────────────
function renderAmortTable(schedule, startMonth, startYear, view) {
  const tbody = mel('mort-amort-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const colLbl = mel('mort-amort-col-lbl');

  if (view === 'annual') {
    if (colLbl) colLbl.textContent = 'Year';

    // Group rows into calendar-year buckets
    const groups = {};
    schedule.forEach(row => {
      const offset  = (startMonth - 1) + (row.month - 1);
      const calYear = startYear + Math.floor(offset / 12);
      if (!groups[calYear]) groups[calYear] = { principal: 0, interest: 0, balance: 0 };
      groups[calYear].principal += row.principal;
      groups[calYear].interest  += row.interest;
      groups[calYear].balance    = row.balance;
    });

    Object.keys(groups)
      .sort((a, b) => a - b)
      .forEach(yr => {
        const d  = groups[yr];
        const tr = document.createElement('tr');
        tr.innerHTML =
          `<td>${yr}</td>` +
          `<td>${fmtCurrency(d.principal)}</td>` +
          `<td>${fmtCurrency(d.interest)}</td>` +
          `<td>${fmtCurrency(d.principal + d.interest)}</td>` +
          `<td>${fmtCurrency(d.balance)}</td>`;
        tbody.appendChild(tr);
      });

  } else {
    if (colLbl) colLbl.textContent = 'Month';

    schedule.forEach(row => {
      const label = monthLabel(row.month, startMonth, startYear);
      const tr    = document.createElement('tr');
      tr.innerHTML =
        `<td>${label}</td>` +
        `<td>${fmtCurrency(row.principal)}</td>` +
        `<td>${fmtCurrency(row.interest)}</td>` +
        `<td>${fmtCurrency(row.principal + row.interest)}</td>` +
        `<td>${fmtCurrency(row.balance)}</td>`;
      tbody.appendChild(tr);
    });
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
function initMortgage() {

  // Loan term buttons
  document.querySelectorAll('.mort-term-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mort-term-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mortTerm = parseInt(btn.dataset.term);
      calculateMortgage();
    });
  });

  // Down payment mode toggle (% ↔ $)
  document.querySelectorAll('.mort-dp-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mort-dp-mode').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const prevMode = mortDpMode;
      mortDpMode     = btn.dataset.mode;
      const prefix   = mel('mort-dp-prefix');
      if (prefix) prefix.textContent = mortDpMode === 'pct' ? '%' : '$';

      // Convert current value to new unit
      const homePrice = mgv('mort-home-price');
      const current   = mgv('mort-down-payment');
      const input     = mel('mort-down-payment');
      if (prevMode === 'pct' && mortDpMode === 'dollar') {
        input.value = Math.round(homePrice * current / 100);
        input.step  = '1000';
      } else if (prevMode === 'dollar' && mortDpMode === 'pct') {
        input.value = homePrice > 0 ? (current / homePrice * 100).toFixed(1) : '20';
        input.step  = '0.5';
      }
      calculateMortgage();
    });
  });

  // Property tax mode toggle (% ↔ $)
  document.querySelectorAll('.mort-tax-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mort-tax-mode').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const prevMode = mortTaxMode;
      mortTaxMode    = btn.dataset.mode;
      const prefix   = mel('mort-tax-prefix');
      if (prefix) prefix.textContent = mortTaxMode === 'pct' ? '%' : '$';

      // Convert current value to new unit
      const homePrice = mgv('mort-home-price');
      const current   = mgv('mort-prop-tax');
      const input     = mel('mort-prop-tax');
      if (prevMode === 'pct' && mortTaxMode === 'dollar') {
        input.value       = Math.round(homePrice * current / 100);
        input.step        = '100';
        input.placeholder = '4800';
      } else if (prevMode === 'dollar' && mortTaxMode === 'pct') {
        input.value       = homePrice > 0 ? (current / homePrice * 100).toFixed(2) : '1.20';
        input.step        = '0.05';
        input.placeholder = '1.2';
      }
      calculateMortgage();
    });
  });

  // Collapsible — Taxes & Costs (open by default)
  mel('mort-costs-toggle').addEventListener('click', () => {
    const btn      = mel('mort-costs-toggle');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    const body = mel('mort-costs-body');
    if (expanded) body.setAttribute('hidden', '');
    else          body.removeAttribute('hidden');
  });

  // Collapsible — Extra Payments (closed by default)
  mel('mort-extra-toggle').addEventListener('click', () => {
    const btn      = mel('mort-extra-toggle');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    const body = mel('mort-extra-body');
    if (expanded) body.setAttribute('hidden', '');
    else          body.removeAttribute('hidden');
  });

  // Amortization view toggle
  mel('mort-annual-btn').addEventListener('click', () => {
    mortAmortView = 'annual';
    mel('mort-annual-btn').classList.add('active');
    mel('mort-monthly-btn').classList.remove('active');
    renderAmortTable(
      mortSchedule,
      parseInt(mel('mort-start-month').value) || 3,
      parseInt(mel('mort-start-year').value)  || 2026,
      'annual'
    );
  });

  mel('mort-monthly-btn').addEventListener('click', () => {
    mortAmortView = 'monthly';
    mel('mort-monthly-btn').classList.add('active');
    mel('mort-annual-btn').classList.remove('active');
    renderAmortTable(
      mortSchedule,
      parseInt(mel('mort-start-month').value) || 3,
      parseInt(mel('mort-start-year').value)  || 2026,
      'monthly'
    );
  });

  // Live recalculation — all numeric inputs
  [
    'mort-home-price', 'mort-down-payment', 'mort-interest-rate', 'mort-start-year',
    'mort-prop-tax', 'mort-home-ins', 'mort-pmi', 'mort-hoa', 'mort-other',
    'mort-extra-monthly', 'mort-extra-yearly', 'mort-extra-once', 'mort-extra-once-mo'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateMortgage);
  });

  // Start month select
  const startMonthEl = mel('mort-start-month');
  if (startMonthEl) startMonthEl.addEventListener('change', calculateMortgage);

  // Initial render
  calculateMortgage();
}

document.addEventListener('DOMContentLoaded', initMortgage);
