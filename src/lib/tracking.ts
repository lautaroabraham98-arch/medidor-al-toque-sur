// Google Ads tracking (gtag.js) + click/lead attribution.
//
// Replace GOOGLE_ADS_ID and the conversion labels with the real values from
// Google Ads (Goals → Conversions → each action → "Tag setup").
//
// Consent route: no cookie banner. The tag only loads for visitors outside the
// regions that require prior consent (EEA, UK, Switzerland) and is also skipped
// when the region can't be resolved or the browser sends Global Privacy Control.

import type { Attribution } from "./site";

export const GOOGLE_ADS_ID = "AW-XXXXXXXXXX";

export const CONVERSION_LABELS = {
  form_submit: "LABEL_FORM_SUBMIT",
  whatsapp_click: "LABEL_WHATSAPP_CLICK",
  phone_click: "LABEL_PHONE_CLICK",
} as const;

export type ConversionName = keyof typeof CONVERSION_LABELS;

const IS_PLACEHOLDER = GOOGLE_ADS_ID.includes("XXXX");

const CONSENT_REGIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
]);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

type State = "pending" | "allowed" | "blocked";
let state: State = "pending";
let started = false;
const queue: Array<[ConversionName, Record<string, string>]> = [];

/* ---------------- Attribution (gclid + UTM) ---------------- */

const ATTR_KEYS = ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_term"] as const;
const ATTR_STORAGE = "lead_attribution";

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(ATTR_STORAGE) || "{}");
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};
  for (const k of ATTR_KEYS) {
    const v = params.get(k);
    if (v) fresh[k] = v.slice(0, 200);
  }
  const merged = Object.keys(fresh).length ? fresh : stored;
  try {
    sessionStorage.setItem(ATTR_STORAGE, JSON.stringify(merged));
  } catch {
    /* storage unavailable */
  }
  return merged;
}

/* ---------------- Region gate + tag loading ---------------- */

async function resolveCountry(): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch("/cdn-cgi/trace", { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) return null;
    const text = await res.text();
    const kv: Record<string, string> = {};
    for (const line of text.split("\n")) {
      const i = line.indexOf("=");
      if (i > 0) kv[line.slice(0, i)] = line.slice(i + 1).trim();
    }
    const host = kv["h"];
    if (host && host !== window.location.host && host !== window.location.hostname) return null;
    const loc = kv["loc"];
    if (!loc || loc === "XX" || loc === "T1") return null;
    return loc.toUpperCase();
  } catch {
    return null;
  }
}

function allow() {
  state = "allowed";
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ADS_ID);

  // Skip the network request while the ID is still a placeholder;
  // events keep queueing in dataLayer so the wiring can be checked.
  if (!IS_PLACEHOLDER) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(s);
  }

  for (const [name, params] of queue.splice(0)) send(name, params);
}

export function initTracking() {
  if (typeof window === "undefined" || started) return;
  started = true;
  if (navigator.globalPrivacyControl) {
    state = "blocked";
    return;
  }
  void resolveCountry().then((country) => {
    if (!country || CONSENT_REGIONS.has(country)) {
      state = "blocked";
      queue.length = 0;
      return;
    }
    allow();
  });
}

function send(name: ConversionName, params: Record<string, string>) {
  if (!window.gtag) return;
  window.gtag("event", name, params);
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${CONVERSION_LABELS[name]}`,
    ...params,
  });
}

/**
 * Sends a conversion. `localidad` and `variante` (landing variant from ?tramite=)
 * always go out; any other non-empty params (conexion, uso, cantidad, instalacion,
 * ubicacion) are passed through, plus utm_* from the stored attribution.
 */
export function trackConversion(name: ConversionName, params: Record<string, string | undefined>) {
  if (typeof window === "undefined" || state === "blocked") return;
  const { gclid: _gclid, ...utm } = captureAttribution();
  const extra: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) if (v) extra[k] = v;
  const payload: Record<string, string> = {
    ...extra,
    variante: params.variante || "general",
    localidad: params.localidad || "sin_especificar",
    ...utm,
  };
  if (state === "pending") {
    queue.push([name, payload]);
    return;
  }
  send(name, payload);
}
