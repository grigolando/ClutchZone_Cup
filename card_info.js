// PLS Refresh This Page Once To See The Actual TIME! 🕑

'use strict';

// Utility: convert Tbilisi (data.time "HH:MM") -> user's local time string "HH:MM"
function convertTbilisiTimeToLocalString(tbilisiTime) {
  if (!tbilisiTime || typeof tbilisiTime !== 'string') return null;
  const parts = tbilisiTime.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!parts) return null;

  const hh = Number(parts[1]);
  const mm = Number(parts[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    return null;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();

  // Tbilisi = UTC+4 => subtract 4 hours to get UTC instant
  const utcMillis = Date.UTC(year, month, day, hh - 4, mm, 0, 0);
  const utcDate = new Date(utcMillis);

  return utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Detect whether current navigation was a reload
function navigationIsReload() {
  try {
    const navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type === 'reload';
    }
    // fallback for older browsers
    if (performance && performance.navigation) {
      // 1 === TYPE_RELOAD
      return performance.navigation.type === 1;
    }
  } catch (e) {
    // ignore and assume not reload
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  // =====================
  // ALERT logic:
  // - show alert when navigation type is NOT 'reload'
  //   (i.e., show on first load and when navigating back to this page,
  //    but don't show on browser refresh)
  if (!navigationIsReload()) {
    alert("PLS Refresh This Page Once To See The Actual TIME! 🕑 (There is a chance to be the same time, but after reload it 100% true)");
  }

  // =====================
  // DOM elements (queried after DOM ready)
  const select_currency = document.getElementById('select_currency_select');
  const prizes = Array.from(document.getElementsByClassName('prize_for_winners') || []);
  const game_entry_fee_el = document.getElementById('game_entry_fee');
  const timeEl = document.getElementById('time');

  // Load data (localStorage)
  const raw = localStorage.getItem("tournamentData");
  const data = raw ? JSON.parse(raw) : null;

  // Currency setup
  const rates = { USD: 2.7, EURO: 3, Gell: 1 };
  const rates_currency = { USD: ' $', EURO: ' €', Gell: ' ₾' };

  // --- capture base numeric values
  function getBaseValues() {
    const basePrizeValues = prizes.map(p => {
      const n = parseFloat(String(p.innerText || '').replace(/[^\d.\-]/g, ''));
      return Number.isFinite(n) ? n : 0;
    });

    const entryRaw = game_entry_fee_el?.innerText ?? '0';
    const entryNum = parseFloat(String(entryRaw).replace(/[^\d.\-]/g, ''));
    const baseEntryFee = Number.isFinite(entryNum) ? entryNum : 0;

    return { basePrizeValues, baseEntryFee };
  }

  let { basePrizeValues: baseValues, baseEntryFee } = getBaseValues();

  function formatValue(value, currencySymbol) {
    return Number(value).toFixed(2) + currencySymbol;
  }

  function changing_currency() {
    const selected = select_currency?.value || 'Gell';
    const rate = rates[selected] ?? 1;
    const rate_currency = rates_currency[selected] ?? ' ₾';

    if (!baseValues || baseValues.length !== prizes.length) {
      ({ basePrizeValues: baseValues } = getBaseValues());
    }

    for (let i = 0; i < prizes.length; i++) {
      const converted = baseValues[i] / rate;
      prizes[i].innerText = formatValue(converted, rate_currency);
    }

    if (game_entry_fee_el) {
      game_entry_fee_el.innerText = formatValue(baseEntryFee / rate, rate_currency);
    }

    const poolEl = document.getElementById('prize_pool');
    if (poolEl) {
      const poolSumConverted = baseValues.reduce((s, v) => s + (v / rate), 0);
      poolEl.innerText = formatValue(poolSumConverted, rate_currency);
    }
  }

  // attach listener for currency select
  select_currency?.addEventListener('change', changing_currency);

  // =====================
  // Fill DOM from data (only once) and handle time conversion
  if (data) {
    const headerEl = document.querySelector('header');
    if (headerEl && data.img) headerEl.style.backgroundImage = `url(${data.img})`;

    const gameImgEl = document.getElementById('game_img');
    if (gameImgEl && data.sub_img) gameImgEl.src = data.sub_img;

    const titleEl = document.getElementById('title');
    if (titleEl && data.title) titleEl.innerText = data.title;

    const gameTitleEl = document.getElementById('game_title');
    if (gameTitleEl && data.sub_title) gameTitleEl.innerText = data.sub_title;

    const dateEl = document.getElementById('date');
    if (dateEl && data.date) dateEl.innerText = data.date;

    if (game_entry_fee_el && data.entry_fee !== undefined) game_entry_fee_el.innerText = data.entry_fee;

    const prize1El = document.getElementById('prize1');
    const prize2El = document.getElementById('prize2');
    const prize3El = document.getElementById('prize3');
    if (prize1El && data.place1 !== undefined) prize1El.innerText = data.place1;
    if (prize2El && data.place2 !== undefined) prize2El.innerText = data.place2;
    if (prize3El && data.place3 !== undefined) prize3El.innerText = data.place3;

    // prize pool
    const poolEl = document.getElementById('prize_pool');
    const poolSum = Number(data.place1 || 0) + Number(data.place2 || 0) + Number(data.place3 || 0);
    if (poolEl) poolEl.innerText = poolSum;

    // ---------------------
    // TIME: compute and write only after conversion
    let finalLocalTimeStr = null;

    // 1) prefer explicit ISO UTC if provided in data.utc OR element data-utc
    const explicitUtcFromElement = timeEl?.getAttribute('data-utc') || timeEl?.dataset?.utc;
    const explicitUtcFromData = data.utc || data.datetime || null; // optional fields if available

    const explicitUtc = explicitUtcFromElement || explicitUtcFromData;

    if (explicitUtc) {
      const parsed = new Date(String(explicitUtc).trim());
      if (!isNaN(parsed)) {
        finalLocalTimeStr = parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        const tryD = new Date(String(explicitUtc).replace(/\s+$/, ''));
        if (!isNaN(tryD)) finalLocalTimeStr = tryD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }

    // 2) if no explicit UTC, use data.time (Tbilisi HH:MM)
    if (!finalLocalTimeStr && data.time) {
      finalLocalTimeStr = convertTbilisiTimeToLocalString(data.time);
    }

    // 3) if still no, try element innerText (rare)
    if (!finalLocalTimeStr && timeEl) {
      const possible = (timeEl.innerText || '').trim();
      if (possible) {
        finalLocalTimeStr = convertTbilisiTimeToLocalString(possible) || null;
        if (!finalLocalTimeStr) {
          const tryD = new Date(possible);
          if (!isNaN(tryD)) finalLocalTimeStr = tryD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      }
    }

    // write result to DOM once
    if (timeEl) {
      if (finalLocalTimeStr) {
        timeEl.textContent = `Tournament starts at: ${finalLocalTimeStr}`;
      } else {
        timeEl.textContent = 'Tournament start time not set';
        console.warn('Could not determine tournament time. data.time:', data.time, 'data.utc:', explicitUtc);
      }
    }
  } else {
    // no data: ensure UI still computes currency from existing DOM numbers
    ({ basePrizeValues: baseValues, baseEntryFee } = getBaseValues());
    changing_currency();
  }

  // Recompute currency values now that DOM is populated
  ({ basePrizeValues: baseValues, baseEntryFee } = getBaseValues());
  changing_currency();

  // NOTE: no auto-reload here.
});
