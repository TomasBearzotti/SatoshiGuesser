import en from "./en.js";
import es from "./es.js";

const translations = {
  en,
  es,
};

const STORAGE_KEY = "satoshiguesser_locale";
let currentLocale = "en";

export const supportedLocales = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export function initI18n() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && translations[saved]) {
    currentLocale = saved;
  } else {
    // Default to en
    currentLocale = "en";
  }
  return currentLocale;
}

export function getLocale() {
  return currentLocale;
}

export function setLocale(locale) {
  if (!translations[locale]) return;
  currentLocale = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
  document.documentElement.lang = locale;
  updateDOMTranslations();
  window.dispatchEvent(
    new CustomEvent("localeChanged", { detail: { locale } }),
  );
}

/**
 * Get translation string by dot path, e.g. "topbar.title"
 * Supports variable interpolation: {variable}
 */
export function t(path, params = {}) {
  const keys = path.split(".");
  let val = translations[currentLocale];
  for (const k of keys) {
    if (val && typeof val === "object" && k in val) {
      val = val[k];
    } else {
      // Fallback to English
      let fallback = translations.en;
      for (const fk of keys) {
        if (fallback && typeof fallback === "object" && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return path;
        }
      }
      val = fallback;
      break;
    }
  }

  if (typeof val !== "string") return path;

  return val.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? params[key] : `{${key}}`;
  });
}

/**
 * Updates all DOM elements with data-i18n and data-i18n-attr attributes
 */
export function updateDOMTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");
  for (const el of elements) {
    const key = el.getAttribute("data-i18n");
    if (key) {
      el.textContent = t(key);
    }
  }

  const attrElements = document.querySelectorAll("[data-i18n-attr]");
  for (const el of attrElements) {
    const attrSpecs = el.getAttribute("data-i18n-attr").split(";");
    for (const spec of attrSpecs) {
      const [attrName, key] = spec.split(":").map((s) => s.trim());
      if (attrName && key) {
        el.setAttribute(attrName, t(key));
      }
    }
  }

  const htmlElements = document.querySelectorAll("[data-i18n-html]");
  for (const el of htmlElements) {
    const key = el.getAttribute("data-i18n-html");
    if (key) {
      el.innerHTML = t(key);
    }
  }
}
