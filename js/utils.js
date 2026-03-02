'use strict';

// ============================================================
//  CalcHub — Shared Utilities
//  Include this file first on every calculator page.
// ============================================================

// Currency formatter — two decimal places  ($1,234.56)
const fmtCurrency = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

// Currency formatter — rounded, no cents  ($1,235)
const fmtCurrencyRounded = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
