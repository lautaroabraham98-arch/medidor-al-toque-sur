// Business data and pure helpers for the landing page.
// Service model: a single "llave en mano" service — alta de medidor nuevo
// (instalación/pilar si hace falta + certificado DCI + trámite ante la distribuidora).
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

/* ---------------- Landing variant (?tramite=) ---------------- */

export const VARIANTS = ["medidor", "dci", "pilar", "general"] as const;
export type Variant = (typeof VARIANTS)[number];

export function variantFromParam(param: string | undefined | null): Variant {
  if (param === "medidor" || param === "dci" || param === "pilar") return param;
  return "general";
}

/** Hero headline driven by the `tramite` URL parameter. */
export function headlineFor(param: string | undefined | null): string {
  switch (variantFromParam(param)) {
    case "medidor":
      return "Medidor nuevo de luz: instalación, DCI y trámite con electricista matriculado";
    case "dci":
      return "Certificado DCI para tu medidor nuevo, con electricista matriculado";
    case "pilar":
      return "Pilar de luz y medidor nuevo, con electricista matriculado";
    default:
      return "Medidor nuevo de luz en Zona Sur, con electricista matriculado";
  }
}

/* ---------------- Form options ---------------- */

type Option<V extends string> = { value: V; label: string; phrase: string };

export const CONEXIONES = [
  { value: "monofasico", label: "Monofásico", phrase: "monofásico" },
  { value: "trifasico", label: "Trifásico", phrase: "trifásico" },
  { value: "no-se", label: "No sé (lo definimos juntos)", phrase: "(monofásico o trifásico, a definir)" },
] as const satisfies readonly Option<string>[];

export const USOS = [
  { value: "vivienda", label: "Vivienda", phrase: "vivienda" },
  { value: "local", label: "Local comercial", phrase: "local comercial" },
  { value: "obra", label: "Obra o terreno", phrase: "obra o terreno" },
  { value: "otro", label: "Otro", phrase: "otro uso" },
] as const satisfies readonly Option<string>[];

export const CANTIDADES = [
  { value: "1", label: "1", phrase: "1" },
  { value: "2", label: "2", phrase: "2" },
  { value: "3", label: "3", phrase: "3" },
  { value: "4", label: "4", phrase: "4" },
  { value: "5", label: "5", phrase: "5" },
  { value: "6+", label: "6+", phrase: "6 o más" },
] as const satisfies readonly Option<string>[];

export const INSTALACIONES = [
  { value: "pilar-ok", label: "Ya tengo pilar en condiciones", phrase: "ya tengo pilar en condiciones" },
  {
    value: "pilar-viejo",
    label: "Tengo pilar pero está viejo o no sé si sirve",
    phrase: "tengo pilar pero está viejo o no sé si sirve",
  },
  { value: "sin-pilar", label: "No tengo, hay que hacerlo", phrase: "no tengo pilar, hay que hacerlo" },
  { value: "no-se", label: "No sé", phrase: "no sé cómo está" },
] as const satisfies readonly Option<string>[];

export type Conexion = (typeof CONEXIONES)[number]["value"];
export type Uso = (typeof USOS)[number]["value"];
export type Cantidad = (typeof CANTIDADES)[number]["value"];
export type Instalacion = (typeof INSTALACIONES)[number]["value"];

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

function phraseOf<V extends string>(list: readonly Option<V>[], value: V): string {
  return list.find((o) => o.value === value)?.phrase ?? value;
}

const values = <V extends string>(list: readonly Option<V>[]) =>
  list.map((o) => o.value) as unknown as [V, ...V[]];

/* ---------------- Validation ---------------- */

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

const pick = (message: string) => ({ errorMap: () => ({ message }) });

/** Step 1 — "Contanos qué necesitás". */
export const stepOneSchema = z.object({
  conexion: z.enum(values(CONEXIONES), pick("Elegí el tipo de conexión")),
  uso: z.enum(values(USOS), pick("Elegí el uso")),
  cantidad: z.enum(values(CANTIDADES), pick("Elegí la cantidad de medidores")),
  instalacion: z.enum(values(INSTALACIONES), pick("Contanos cómo está tu instalación")),
});

/** Step 2 — "¿Dónde es?". */
export const stepTwoSchema = z.object({
  localidad: z.enum(LOCALIDADES, pick("Elegí tu localidad")),
  direccion: z.string().trim().max(80, "La dirección es muy larga").optional().default(""),
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

export const leadSchema = stepOneSchema.merge(stepTwoSchema);
export type LeadInput = z.infer<typeof leadSchema>;

export type Attribution = Partial<
  Record<"gclid" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_term", string>
>;

/* ---------------- WhatsApp messages ---------------- */

/** Prefilled WhatsApp message after a form submission. */
export function buildLeadMessage(
  lead: Omit<LeadInput, "whatsapp" | "direccion"> & { direccion?: string; attribution?: Attribution },
): string {
  const lugar = lead.localidad === "Otra" ? "otra localidad de Zona Sur" : lead.localidad;
  const direccion = lead.direccion?.trim();
  const donde = direccion ? `${direccion}, ${lugar}` : lugar;
  let msg =
    `Hola Lautaro, necesito un medidor nuevo ${phraseOf(CONEXIONES, lead.conexion)} ` +
    `para ${phraseOf(USOS, lead.uso)}, cantidad: ${phraseOf(CANTIDADES, lead.cantidad)}, ` +
    `instalación: ${phraseOf(INSTALACIONES, lead.instalacion)}, en ${donde}. ` +
    `Mi nombre es ${lead.nombre.trim()}.`;
  const a = lead.attribution ?? {};
  const ref = [a.utm_source, a.utm_medium, a.utm_campaign, a.utm_term].filter(Boolean).join("/");
  const parts = [ref, a.gclid ? `gclid ${a.gclid}` : ""].filter(Boolean);
  if (parts.length) msg += `\n\n(Ref: ${parts.join(" · ")})`;
  return msg;
}

/** Generic WhatsApp message for the header / floating / bottom-bar buttons. */
export function buildGenericMessage(variant: Variant = "general"): string {
  if (variant === "dci") return "Hola Lautaro, quiero presupuesto para el certificado DCI de mi medidor nuevo.";
  if (variant === "pilar") return "Hola Lautaro, quiero presupuesto para el pilar de luz y el medidor nuevo.";
  return "Hola Lautaro, quiero presupuesto para un medidor nuevo de luz.";
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
