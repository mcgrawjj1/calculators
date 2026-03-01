'use strict';

// ============================================================
//  CalcHub — Car Payment Calculator
//  Formula: M = P · r(1+r)^n / [(1+r)^n − 1]
//    P = principal (financed amount)
//    r = monthly interest rate (APR / 12)
//    n = number of monthly payments (loan term)
// ============================================================

let selectedTerm = 60; // months — matches the default "5 yr" button

// ── Formatters ───────────────────────────────────────────────

const fmtCurrency = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const fmtCurrencyRounded = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

// ── Helpers ──────────────────────────────────────────────────

function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function setEl(id, text) {
  document.getElementById(id).textContent = text;
}

// ── Core calculation ─────────────────────────────────────────

function calculate() {
  const price   = getVal('vehicle-price');
  const down    = getVal('down-payment');
  const tradeIn = getVal('trade-in');
  const taxRate = getVal('tax-rate');   // percentage, e.g. 6.0
  const apr     = getVal('apr');        // percentage, e.g. 6.9
  const term    = selectedTerm;         // months

  // Tax applies to (price − tradeIn); down payment doesn't reduce taxable basis.
  // Tax amount is rolled into the financed principal (most common scenario).
  const taxableAmount = Math.max(0, price - tradeIn);
  const taxAmount     = taxableAmount * (taxRate / 100);
  const principal     = Math.max(0, price + taxAmount - down - tradeIn);

  // Edge cases
  if (principal <= 0 || apr <= 0 || term <= 0) {
    renderResults(0, principal, 0, principal);
    return;
  }

  const r  = (apr / 100) / 12;                          // monthly rate
  const n  = term;                                       // payments count
  const pn = Math.pow(1 + r, n);                        // (1+r)^n
  const payment       = principal * r * pn / (pn - 1);
  const totalPaid     = payment * n;
  const totalInterest = totalPaid - principal;

  renderResults(payment, principal, totalInterest, totalPaid);
}

// ── DOM update ───────────────────────────────────────────────

function renderResults(payment, principal, interest, total) {
  setEl('monthly-payment', payment > 0 ? fmtCurrency(payment) : '—');
  setEl('loan-amount',     principal > 0 ? fmtCurrencyRounded(principal) : '—');
  setEl('total-interest',  interest  > 0 ? fmtCurrencyRounded(interest)  : '—');
  setEl('total-cost',      total     > 0 ? fmtCurrencyRounded(total)     : '—');

  // Breakdown bar
  const principalPct = total > 0 ? Math.max(0, Math.min(100, (principal / total) * 100)) : 80;
  const interestPct  = 100 - principalPct;

  document.getElementById('bar-principal').style.width = principalPct.toFixed(1) + '%';
  document.getElementById('bar-interest').style.width  = interestPct.toFixed(1)  + '%';
}

// ── Event wiring ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Number inputs — recalculate on every keystroke
  ['vehicle-price', 'down-payment', 'trade-in', 'tax-rate', 'apr'].forEach((id) => {
    document.getElementById(id).addEventListener('input', calculate);
  });

  // Term buttons — toggle active state, update selectedTerm, recalculate
  document.querySelectorAll('.term-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.term-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTerm = parseInt(btn.dataset.months, 10);
      calculate();
    });
  });

  // Run once on load so defaults are immediately visible
  calculate();
});
