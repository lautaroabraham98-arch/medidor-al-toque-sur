// Business data and pure helpers for the landing page.
import { z } from "zod";

/** Set to true to add <meta name="robots" content="noindex"> to the landing. */
export const LANDING_NOINDEX = false;

export const BUSINESS = {
  name: "Lautaro Abraham",
  title: "Electricista Matriculado",
  matricula: "T3-47970",
  zone: "Zona Sur, Buenos Aires",
  phoneDisplay: "11 2880-3482",
  phoneHref: "tel:+541128803482",
  whatsappNumber: "5491128803482",
} as const;

export const TRAMITES = [
  { value: "medidor", label: "Medidor nuevo", phrase: "medidor nuevo" },
  { value: "dci", label: "Certificado DCI", phrase: "certificado DCI" },
  { value: "ambos", label: "Ambos (medidor + DCI)", phrase: "medidor nuevo y certificado DCI" },
  { value: "desde-cero", label: "Instalación desde cero", phrase: "instalación completa desde cero" },
] as const;

export type TramiteValue = (typeof TRAMITES)[number]["value"];

export const LOCALIDADES = [
  "Lomas de Zamora",
  "Banfield",
  "Lanús",
  "Avellaneda",
  "Quilmes",
  "Almirante Brown",
  "Esteban Echeverría",
  "Ezeiza",
  "Temperley",
  "Otra",
] as const;

export type Localidad = (typeof LOCALIDADES)[number];

export function isTramite(value: unknown): value is TramiteValue {
  return TRAMITES.some((t) => t.value === value);
}

/** Hero headline driven by the `tramite` URL parameter. */
export function headlineFor(tramiteParam: string | undefined | null): string {
  if (tramiteParam === "medidor") return "Pedí tu medidor nuevo con un electricista matriculado";
  if (tramiteParam === "dci") return "Certificado DCI para tu medidor, con electricista matriculado";
  return "Medidor nuevo y certificado DCI con electricista matriculado";
}

/** Form preselection from the `tramite` URL parameter. */
export function tramiteFromParam(tramiteParam: string | undefined | null): TramiteValue | "" {
  if (tramiteParam === "medidor" || tramiteParam === "dci") return tramiteParam;
  return "";
}

/**
 * Normalizes an Argentine mobile/landline number to its 10-digit national form
 * (area code + subscriber, without 0 / 15 / +54 9). Returns null when invalid.
 * Accepts e.g. "11 2345-6789", "+54 9 11 2345 6789", "011 15 2345-6789".
 */
export function normalizeArPhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("9") && d.length === 11) d = d.slice(1);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length === 12) {
    // Remove the mobile "15" prefix that follows a 2–4 digit area code.
    for (const areaLen of [2, 3, 4]) {
      if (d.slice(areaLen, areaLen + 2) === "15") {
        d = d.slice(0, areaLen) + d.slice(areaLen + 2);
        break;
      }
    }
  }
  if (d.length !== 10) return null;
  if (!/^[1-3]/.test(d) || d.startsWith("15")) return null;
  return d;
}

const tramiteValues = TRAMITES.map((t) => t.value) as [TramiteValue, ...TramiteValue[]];

export const leadSchema = z.object({
  tramite: z.enum(tramiteValues, { errorMap: () => ({ message: "Elegí el tipo de trámite" }) }),
  localidad: z.enum(LOCALIDADES, { errorMap: () => ({ message: "Elegí tu localidad" }) }),
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre")
    .max(60, "El nombre es muy largo")
    .regex(/^[\p{L}\s.'-]+$/u, "Usá solo letras"),
  whatsapp: z
    .string()
    .trim()
    .max(25, "Número demasiado largo")
    .refine((v) => normalizeArPhone(v) !== null, "Ingresá un WhatsApp válido (ej: 11 2345-6789)"),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type Attribution = Partial<
  Record<"gclid" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_term", string>
>;

export function tramitePhrase(value: TramiteValue): string {
  return TRAMITES.find((t) => t.value === value)?.phrase ?? value;
}

/** Prefilled WhatsApp message after a form submission. */
export function buildLeadMessage(opts: {
  tramite: TramiteValue;
  localidad: Localidad;
  nombre: string;
  attribution?: Attribution;
}): string {
  const lugar = opts.localidad === "Otra" ? "otra localidad de Zona Sur" : opts.localidad;
  let msg = `Hola Lautaro, quiero iniciar el trámite de ${tramitePhrase(opts.tramite)} en ${lugar}. Mi nombre es ${opts.nombre.trim()}.`;
  const a = opts.attribution ?? {};
  const ref = [a.utm_source, a.utm_medium, a.utm_campaign, a.utm_term].filter(Boolean).join("/");
  const parts = [ref, a.gclid ? `gclid ${a.gclid}` : ""].filter(Boolean);
  if (parts.length) msg += `\n\n(Ref: ${parts.join(" · ")})`;
  return msg;
}

/** Generic WhatsApp message for the header / floating buttons. */
export function buildGenericMessage(tramite?: TramiteValue | ""): string {
  if (tramite) return `Hola Lautaro, quiero consultar por el trámite de ${tramitePhrase(tramite)}.`;
  return "Hola Lautaro, quiero consultar por un medidor nuevo / certificado DCI.";
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
