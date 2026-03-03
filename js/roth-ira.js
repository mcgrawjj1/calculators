'use strict';

// ============================================================
//  Roth vs. Traditional IRA Comparison
//  Compares after-tax retirement value of both account types
//  on an equal pre-tax cost basis.
//
//  Traditional: contribute $C/yr, grows tax-deferred, taxed
//               at retirementRate on withdrawal.
//  Roth:        contribute $C*(1-currentRate)/yr (after-tax
//               equivalent), grows entirely tax-free.
//
//  Winner: if currentRate < retirementRate → Roth wins
//          if currentRate > retirementRate → Traditional wins
// ============================================================

// ── Helpers ───────────────────────────────────────────────────────────────────
// Note: fmtCurrency and fmtCurrencyRounded are defined in js/utils.js (loaded first)

function gv(id)        { return parseFloat(document.getElementById(id).value) || 0; }
function sel(id)       { return document.getElementById(id); }
function set(id, txt)  { const e = sel(id); if (e) e.textContent = txt; }
function show(id, vis) { const e = sel(id); if (e) e.style.display = vis ? '' : 'none'; }

// ── State ─────────────────────────────────────────────────────────────────────
let rothSchedule = [];

// ── Core Calculation ──────────────────────────────────────────────────────────
function calculateRoth() {
  const contrib    = gv('roth-contribution');
  const currentAge = Math.floor(gv('roth-current-age'));
  const retireAge  = Math.floor(gv('roth-retire-age'));
  const returnRate = gv('roth-return') / 100;
  const currentTax = gv('roth-current-tax') / 100;
  const retireTax  = gv('roth-retire-tax') / 100;
  const startBal   = gv('roth-starting-balance');

  const years = Math.max(retireAge - currentAge, 0);

  if (years === 0 || contrib < 0) {
    renderResults(0, 0, 0, false);
    rothSchedule = [];
    renderTable([]);
    return;
  }

  rothSchedule = buildSchedule(contrib, currentAge, years, returnRate, currentTax, retireTax, startBal);

  const last = rothSchedule[rothSchedule.length - 1];
  renderResults(last.tradBalance, last.tradAfterTax, last.rothBalance, retireTax);
  renderTable(rothSchedule);
}

function buildSchedule(contrib, currentAge, years, r, currentTax, retireTax, startBal) {
  const schedule    = [];
  const rothContrib = contrib * (1 - currentTax);

  // Roth starting balance: treat any existing balance as already after-tax dollars,
  // and as coming from equivalent after-tax funds for a fair comparison.
  let tradBal = startBal;
  let rothBal = startBal * (1 - currentTax);

  for (let yr = 1; yr <= years; yr++) {
    tradBal = tradBal * (1 + r) + contrib;
    rothBal = rothBal * (1 + r) + rothContrib;

    const tradAfterTax = tradBal * (1 - retireTax);
    const age          = currentAge + yr;
    const advantage    = rothBal - tradAfterTax;

    schedule.push({ year: yr, age, tradBalance: tradBal, tradAfterTax, rothBalance: rothBal, advantage });
  }

  return schedule;
}

// ── DOM Update ────────────────────────────────────────────────────────────────
function renderResults(tradBal, tradAfterTax, rothBal, retireTax) {
  const empty = tradBal === 0 && rothBal === 0;

  set('roth-trad-balance',  empty ? '—' : fmtCurrencyRounded(tradBal));
  set('roth-trad-aftertax', empty ? '—' : fmtCurrencyRounded(tradAfterTax));
  set('roth-roth-balance',  empty ? '—' : fmtCurrencyRounded(rothBal));

  // Winner callout
  let winnerText = '';
  let rothWins   = false;

  if (!empty) {
    if (rothBal > tradAfterTax + 0.5) {
      rothWins   = true;
      const diff = rothBal - tradAfterTax;
      winnerText = `Roth saves you ${fmtCurrencyRounded(diff)} more at retirement`;
    } else if (tradAfterTax > rothBal + 0.5) {
      const diff = tradAfterTax - rothBal;
      winnerText = `Traditional saves you ${fmtCurrencyRounded(diff)} more at retirement`;
    } else {
      winnerText = 'Both accounts perform equally at these tax rates';
    }
  }

  set('roth-winner', winnerText);
  show('roth-winner', !empty);

  // Toggle winner card highlight
  const tradCard = sel('roth-trad-card');
  const rothCard = sel('roth-roth-card');
  if (tradCard && rothCard) {
    tradCard.classList.toggle('result-account--winner', !empty && !rothWins && tradAfterTax > rothBal + 0.5);
    rothCard.classList.toggle('result-account--winner', !empty && rothWins);
  }

  // Tax-drag bar: shows what % of traditional balance survives taxes
  if (!empty && tradBal > 0) {
    const keptPct = (tradAfterTax / tradBal) * 100;
    const taxPct  = 100 - keptPct;
    const keptBar = sel('bar-trad-kept');
    const taxBar  = sel('bar-trad-tax');
    if (keptBar) keptBar.style.width = keptPct.toFixed(1) + '%';
    if (taxBar)  taxBar.style.width  = taxPct.toFixed(1) + '%';
  }
}

function renderTable(schedule) {
  const tbody = sel('roth-table-body');
  if (!tbody) return;

  if (!schedule.length) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px 14px">' +
      'Enter valid inputs to see the year-by-year projection</td></tr>';
    return;
  }

  tbody.innerHTML = schedule.map(row => {
    const advPos  = row.advantage >= 0;
    const advText = advPos
      ? '+' + fmtCurrencyRounded(row.advantage)
      : '−' + fmtCurrencyRounded(Math.abs(row.advantage));
    const advStyle = advPos ? '' : ' style="color:var(--orange)"';

    return (
      '<tr>' +
      `<td>${row.year}</td>` +
      `<td>${row.age}</td>` +
      `<td>${fmtCurrencyRounded(row.tradBalance)}</td>` +
      `<td>${fmtCurrencyRounded(row.rothBalance)}</td>` +
      `<td${advStyle}>${advText}</td>` +
      '</tr>'
    );
  }).join('');
}

// ── Init ──────────────────────────────────────────────────────────────────────
function initRoth() {
  [
    'roth-contribution', 'roth-current-age', 'roth-retire-age',
    'roth-return', 'roth-current-tax', 'roth-retire-tax', 'roth-starting-balance'
  ].forEach(id => {
    const el = sel(id);
    if (el) el.addEventListener('input', calculateRoth);
  });

  calculateRoth();
}

document.addEventListener('DOMContentLoaded', initRoth);
