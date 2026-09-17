import { spin } from "./game/spin.js";
import { loadStats, loadBloom, checkHash160s } from "./game/wallets.js";
import {
  hash160ToAddress,
  randomPrivKey,
  deriveAll,
  parsePrivKey,
} from "./game/crypto.js";
import { Log } from "./ui/log.js";
import { ClassicReels } from "./ui/slot-classic.js";
import { RealisticReels } from "./ui/slot-realistic.js";
import { WinDialog } from "./ui/win-dialog.js";
import { sfx, setMuted, unlock } from "./audio/audio.js";
import {
  initI18n,
  getLocale,
  setLocale,
  t,
  updateDOMTranslations,
} from "./i18n/index.js";

// Throttle for autospin only — manual spamming has no extra cooldown beyond
// the natural duration of the spin animation. With "no delay" on, autospin
// drops to one frame per spin so the CPU doesn't get pegged.
const AUTOSPIN_DELAY_MS = 250;
const AUTOSPIN_DELAY_NO_DELAY_MS = 16;
const SATS_PER_BTC = 100_000_000;

let cachedStats = null;

function fmtNumber(n) {
  return n.toLocaleString(getLocale() === "es" ? "es-ES" : "en-US");
}

function fmtUsdShort(usd) {
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(2)}T`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(2)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(2)}M`;
  return `$${fmtNumber(Math.round(usd))}`;
}

function fmtOdds(walletCount) {
  // 2^256 is huge; use logs for the scientific form.
  // log10(2^256) = 256 * log10(2) ≈ 77.0588
  const log10Keyspace = 256 * Math.log10(2);
  const log10Denom = log10Keyspace - Math.log10(walletCount);
  const exponent = Math.floor(log10Denom);
  const mantissa = Math.pow(10, log10Denom - exponent);
  const prefix = getLocale() === "es" ? "1 en" : "1 in";
  return `${prefix} ${mantissa.toFixed(2)} × 10^${exponent}`;
}

function fmtTagline(usd) {
  const billions = Math.floor(usd / 1e9);
  if (billions >= 1) {
    return t("topbar.taglineBillion", { amount: fmtNumber(billions) });
  }
  const millions = Math.floor(usd / 1e6);
  if (millions >= 1) {
    return t("topbar.taglineMillion", { amount: fmtNumber(millions) });
  }
  return t("topbar.taglineDollars", { amount: fmtNumber(Math.floor(usd)) });
}

function renderHeaderStats(stats) {
  if (!stats) return;
  const totalBtc = stats.totalBtc;
  const totalUsd = totalBtc * stats.btcUsdApprox;
  document.getElementById("tagline").textContent = fmtTagline(totalUsd);
  document.getElementById("stat-jackpot-btc").textContent =
    `${fmtNumber(Math.round(totalBtc))} BTC`;
  document.getElementById("stat-jackpot-usd").textContent =
    `≈ ${fmtUsdShort(totalUsd)}`;
  document.getElementById("stat-odds").textContent = fmtOdds(stats.walletCount);
  document.getElementById("stat-odds-flavor").textContent =
    t("topbar.oddsFlavor");
  document.getElementById("stat-wallet-count").textContent = fmtNumber(
    stats.walletCount,
  );
  document.getElementById("stat-snapshot").textContent = t(
    "topbar.priceSnapshot",
    { date: stats.priceSnapshotDate },
  );
}

function shorten(s, n = 8) {
  if (s.length <= n * 2 + 3) return s;
  return `${s.slice(0, n)}…${s.slice(-n)}`;
}

async function main() {
  initI18n();
  updateDOMTranslations();

  const stats = await loadStats();
  cachedStats = stats;
  // Eager-load Bloom so the first spin doesn't have a visible stall.
  loadBloom();

  renderHeaderStats(stats);

  // Language Selector
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.value = getLocale();
    langSelect.addEventListener("change", (e) => {
      setLocale(e.target.value);
      renderHeaderStats(cachedStats);
    });
  }

  window.addEventListener("localeChanged", () => {
    if (langSelect) langSelect.value = getLocale();
    renderHeaderStats(cachedStats);
  });

  // Tab Navigation Setup
  const tabBtnPlay = document.getElementById("tab-btn-play");
  const tabBtnAbout = document.getElementById("tab-btn-about");
  const panelPlay = document.getElementById("panel-play");
  const panelAbout = document.getElementById("panel-about");
  const aboutPlayBtn = document.getElementById("about-play-btn");

  function switchTab(tab) {
    if (tab === "about") {
      tabBtnPlay.classList.remove("active");
      tabBtnPlay.setAttribute("aria-selected", "false");
      tabBtnAbout.classList.add("active");
      tabBtnAbout.setAttribute("aria-selected", "true");

      panelPlay.classList.add("hidden");
      panelAbout.classList.remove("hidden");
      window.location.hash = "about";
    } else {
      tabBtnAbout.classList.remove("active");
      tabBtnAbout.setAttribute("aria-selected", "false");
      tabBtnPlay.classList.add("active");
      tabBtnPlay.setAttribute("aria-selected", "true");

      panelAbout.classList.add("hidden");
      panelPlay.classList.remove("hidden");
      if (
        window.location.hash === "#about" ||
        window.location.hash === "#how-it-works"
      ) {
        window.location.hash = "";
      }
    }
  }

  tabBtnPlay.addEventListener("click", () => switchTab("play"));
  tabBtnAbout.addEventListener("click", () => switchTab("about"));
  if (aboutPlayBtn) {
    aboutPlayBtn.addEventListener("click", () => {
      switchTab("play");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Initial tab check from URL hash
  if (
    window.location.hash === "#about" ||
    window.location.hash === "#how-it-works"
  ) {
    switchTab("about");
  }

  const log = new Log(document.getElementById("log"));
  log.append(
    t("game.loadedWallets", {
      count: fmtNumber(stats.walletCount),
      btc: stats.totalBtc.toFixed(2),
    }),
  );
  log.append(t("game.oddsLog", { odds: fmtOdds(stats.walletCount) }));
  log.append(t("game.pullLever"));

  const classic = new ClassicReels(document.getElementById("reels-classic"));
  const realistic = new RealisticReels(
    document.getElementById("reels-realistic"),
  );

  const winDialog = new WinDialog(
    document.getElementById("win-dialog"),
    stats.btcUsdApprox,
  );

  const pullBtn = document.getElementById("pull-btn");
  const realisticToggle = document.getElementById("toggle-realistic");
  const noDelayToggle = document.getElementById("toggle-no-delay");
  const autospinToggle = document.getElementById("toggle-autospin");
  const soundToggle = document.getElementById("toggle-sound");

  let realisticMode = realisticToggle ? realisticToggle.checked : true;
  if (realisticMode) {
    classic.hide();
    realistic.show();
  } else {
    realistic.hide();
    classic.show();
  }

  realisticToggle.addEventListener("change", (e) => {
    realisticMode = e.target.checked;
    if (realisticMode) {
      classic.hide();
      realistic.show();
    } else {
      realistic.hide();
      classic.show();
    }
  });

  setMuted(!soundToggle.checked);
  soundToggle.addEventListener("change", (e) => {
    setMuted(!e.target.checked);
  });

  autospinToggle.addEventListener("change", (e) => {
    if (e.target.checked && !busy) onPull();
  });

  // Settings dialog ----------------------------------------------------------
  const settingsBtn = document.getElementById("settings-btn");
  const settingsDialog = document.getElementById("settings-dialog");
  const settingsClose = document.getElementById("settings-close");
  const manualInput = document.getElementById("manual-key-input");
  const manualBtn = document.getElementById("manual-check-btn");
  const manualResult = document.getElementById("manual-result");

  settingsBtn.addEventListener("click", () => {
    if (typeof settingsDialog.showModal === "function") {
      settingsDialog.showModal();
    } else {
      settingsDialog.setAttribute("open", "");
    }
  });
  settingsClose.addEventListener("click", () => settingsDialog.close());

  function setManualResult(text, kind) {
    manualResult.textContent = text;
    manualResult.classList.remove("ok", "fail", "err");
    if (kind) manualResult.classList.add(kind);
  }

  async function onManualCheck() {
    setManualResult("", null);
    const raw = manualInput.value.trim();
    if (!raw) {
      setManualResult(t("settings.enterKeyFirst"), "err");
      return;
    }
    let parsed;
    try {
      parsed = parsePrivKey(raw);
    } catch (err) {
      setManualResult(err.message, "err");
      return;
    }
    setManualResult(t("settings.checking"), null);
    try {
      const derived = deriveAll(parsed.privKey);
      const candidates = [
        derived.hash160Uncompressed,
        derived.hash160Compressed,
      ];
      const hit = await checkHash160s(candidates);
      log.append(
        `manual: addr=${derived.addressUncompressed.slice(0, 8)}… ` +
          `(${parsed.format}) → ${hit ? "MATCH" : "no match"}`,
      );
      if (hit) {
        setManualResult(t("settings.matchPrize"), "ok");
        settingsDialog.close();
        winDialog.show({
          privKey: parsed.privKey,
          derived,
          match: hit,
        });
      } else {
        setManualResult(
          t("settings.noMatchAddr", { address: derived.addressUncompressed }),
          "fail",
        );
      }
    } catch (err) {
      setManualResult(t("settings.error", { message: err.message }), "err");
    }
  }

  manualBtn.addEventListener("click", onManualCheck);
  manualInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onManualCheck();
    }
  });

  // Dev-win flag for QA / curious source-readers.
  const devWin = new URLSearchParams(location.search).get("devwin") === "1";

  let busy = false;
  async function onPull() {
    if (busy) return;
    busy = true;
    pullBtn.disabled = true;
    unlock();
    sfx.lever();

    let forced = null;
    if (devWin) {
      // Force a "win" against the genesis address by reusing its hash160.
      // We don't actually have Satoshi's privkey, so the WIF shown will
      // unlock nothing — it's purely for verifying the win UX.
      const priv = randomPrivKey();
      const derived = deriveAll(priv);
      const fakeMatch = {
        hash160: derived.hash160Uncompressed,
        balanceSats: 5_000_000_000n,
      };
      forced = { privKey: priv, match: fakeMatch };
    }

    const reels = realisticMode ? realistic : classic;
    const noDelay = noDelayToggle.checked;

    if (!noDelay) reels.startSpin();

    let result;
    if (noDelay) {
      result = await spin({ devWin: forced });
    } else {
      const spinAnim = new Promise((r) => setTimeout(r, 1100));
      [, result] = await Promise.all([spinAnim, spin({ devWin: forced })]);
    }

    log.append(
      `key=${shorten(result.privKeyHex, 6)} ` +
        `addr=${shorten(result.derived.addressUncompressed, 6)}`,
    );

    if (noDelay) {
      if (realisticMode) realistic.flashResult(result.privKeyHex, result.win);
      else classic.flashResult(result.win);
    } else if (realisticMode) {
      await realistic.stopSpin(result.privKeyHex, result.win);
    } else {
      await classic.stopSpin(result.win);
    }

    if (result.win) {
      const matchedAddress = hash160ToAddress(result.match.hash160);
      log.append(
        `🎉 MATCH: ${matchedAddress} ` +
          `(${(Number(result.match.balanceSats) / SATS_PER_BTC).toFixed(8)} BTC)`,
      );
      sfx.win();
      // Stop autospin on win — let the player see what happened.
      if (autospinToggle.checked) autospinToggle.checked = false;
      winDialog.show(result);
    } else {
      log.append("→ no match");
      sfx.lose();
    }

    busy = false;
    pullBtn.disabled = false;

    if (autospinToggle.checked) {
      const delay = noDelayToggle.checked
        ? AUTOSPIN_DELAY_NO_DELAY_MS
        : AUTOSPIN_DELAY_MS;
      setTimeout(onPull, delay);
    }
  }

  pullBtn.addEventListener("click", onPull);
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (settingsDialog.open || document.getElementById("win-dialog").open)
      return;
    e.preventDefault();
    onPull();
  });
}

main().catch((err) => {
  console.error(err);
  const log = document.getElementById("log");
  if (log) log.value = `Error: ${err.message}`;
});
