'use strict';

// ============================================================
//  CalcHub — Max Budget (Reverse Auto Loan) Calculator
//
//  Given a target monthly payment M, solves for the maximum
//  vehicle price the user can afford.
//
//  Step 1 — Reverse amortization: solve for max principal P
//    Forward:  M = P · r(1+r)^n / [(1+r)^n − 1]
//    Reverse:  P = M · [(1+r)^n − 1] / [r(1+r)^n]
//
//  Step 2 — Back-calculate max vehicle price from principal
//    Forward tax/principal relationship:
//      principal = (price − tradeIn)(1 + taxRate) − down
//    Solving for price:
//      price = (principal + down) / (1 + taxRate) + tradeIn
//
//  Also handles tab switching between Car Payment and Max Budget.
// ============================================================

// ── Tab switching ────────────────────────────────────────────

function initTabs() {
  const tabs   = document.querySelectorAll('.calc-tab');
  const panels = document.querySelectorAll('.calc-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Deactivate all tabs
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      panels.forEach((p) => { p.classList.remove('is-active'); });

      // Activate clicked tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show target panel
      document.getElementById(target + '-panel').classList.add('is-active');
    });
  });
}

// ── Helpers ──────────────────────────────────────────────────
// Note: fmtCurrency and fmtCurrencyRounded are defined in car-payment.js (loaded first)

function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function setEl(id, text) {
  document.getElementById(id).textContent = text;
}

// ── Max Budget term button state ──────────────────────────────

let mbSelectedTerm = 60; // matches the default active button

// ── Core reverse calculation ─────────────────────────────────

function calculateMaxBudget() {
  const monthlyPayment = getVal('mb-monthly-payment');
  const down           = getVal('mb-down-payment');
  const tradeIn        = getVal('mb-trade-in');
  const taxRate        = getVal('mb-tax-rate');   // e.g. 6.0
  const apr            = getVal('mb-apr');        // e.g. 6.9
  const term           = mbSelectedTerm;          // months

  if (monthlyPayment <= 0 || apr <= 0 || term <= 0) {
    renderMaxBudget(0, 0, 0, 0);
    return;
  }

  const r  = (apr / 100) / 12;         // monthly interest rate
  const n  = term;                      // number of payments
  const pn = Math.pow(1 + r, n);       // (1+r)^n

  // Step 1: max principal (what can be financed)
  const maxPrincipal = monthlyPayment * (pn - 1) / (r * pn);

  // Step 2: back-calculate max vehicle price
  //   principal = (price − tradeIn)(1 + taxRate/100) − down
  //   => price = (principal + down) / (1 + taxRate/100) + tradeIn
  const taxMultiplier = 1 + (taxRate / 100);
  const maxPrice      = (maxPrincipal + down) / taxMultiplier + tradeIn;

  // Verification stats (using the max principal, not price)
  const totalPaid    = monthlyPayment * n;
  const totalInterest = totalPaid - maxPrincipal;

  renderMaxBudget(maxPrice, maxPrincipal, totalInterest, totalPaid);
}

// ── DOM update ───────────────────────────────────────────────

function renderMaxBudget(maxPrice, principal, interest, total) {
  setEl('mb-max-price',      maxPrice   > 0 ? fmtCurrencyRounded(maxPrice)  : '—');
  setEl('mb-loan-amount',    principal  > 0 ? fmtCurrencyRounded(principal) : '—');
  setEl('mb-total-interest', interest   > 0 ? fmtCurrencyRounded(interest)  : '—');
  setEl('mb-total-cost',     total      > 0 ? fmtCurrencyRounded(total)     : '—');

  // Breakdown bar
  const principalPct = total > 0 ? Math.max(0, Math.min(100, (principal / total) * 100)) : 80;
  const interestPct  = 100 - principalPct;

  document.getElementById('mb-bar-principal').style.width = principalPct.toFixed(1) + '%';
  document.getElementById('mb-bar-interest').style.width  = interestPct.toFixed(1)  + '%';
}

// ── Event wiring ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Initialize tab switching
  initTabs();

  // Max budget: number inputs
  ['mb-monthly-payment', 'mb-down-payment', 'mb-trade-in', 'mb-tax-rate', 'mb-apr'].forEach((id) => {
    document.getElementById(id).addEventListener('input', calculateMaxBudget);
  });

  // Max budget: term buttons
  document.querySelectorAll('.mb-term-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mb-term-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      mbSelectedTerm = parseInt(btn.dataset.months, 10);
      calculateMaxBudget();
    });
  });

  // Run once on load so defaults are immediately visible
  calculateMaxBudget();
});
