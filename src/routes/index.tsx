import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  FileCheck2,
  Gauge,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import tablero1600 from "@/assets/tablero-1600.webp";
import tablero800 from "@/assets/tablero-800.webp";
import { LeadForm } from "@/components/landing/LeadForm";
import { MobileContactBar, SiteFooter, SiteHeader } from "@/components/landing/chrome";
import { WhatsAppLink } from "@/components/landing/contact";
import { WhatsAppIcon } from "@/components/landing/icons";
import { LANDING_NOINDEX, headlineFor, variantFromParam, type Localidad } from "@/lib/site";

const searchSchema = z.object({
  tramite: z.string().optional().catch(undefined),
});

const TITLE = "Medidor nuevo de luz en Zona Sur | Electricista matriculado";
const DESCRIPTION =
  "Alta de medidor nuevo llave en mano en Zona Sur, GBA: instalación y pilar si hace falta, certificado DCI firmado por electricista matriculado (T3-47970) y trámite ante la distribuidora.";

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: LANDING_NOINDEX ? "noindex, nofollow" : "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_AR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const CHIPS = [
  { icon: BadgeCheck, text: "Matriculado T3-47970" },
  { icon: MapPin, text: "Zona Sur GBA" },
  { icon: ShieldCheck, text: "Instalación bajo norma" },
];

const STEPS = [
  { title: "Nos contás tu caso", text: "Por el formulario o mandando una foto por WhatsApp." },
  { title: "Te pasamos presupuesto", text: "Sin cargo." },
  {
    title: "Hacemos la instalación y firmamos el DCI",
    text: "Hacemos la instalación y el pilar si hace falta, y firmamos el DCI.",
  },
  {
    title: "Presentamos el trámite de alta",
    text: "Presentamos el trámite de alta y seguimos el expediente hasta que colocan el medidor.",
  },
];

const INCLUDES = [
  {
    icon: Zap,
    title: "Instalación y pilar",
    text: "Si tu instalación o tu pilar no están en condiciones, los dejamos bajo norma. Si ya están bien, seguimos directo.",
    items: [] as string[],
  },
  {
    icon: FileCheck2,
    title: "Certificado DCI",
    text: "",
    items: [
      "Relevamiento de la instalación",
      "DCI firmado por electricista matriculado",
      "Si falta algo, te lo decimos antes de certificar",
    ],
  },
  {
    icon: Gauge,
    title: "Trámite de alta",
    text: "",
    items: [
      "Armamos y presentamos la documentación",
      "Solicitamos que la distribuidora vaya a colocar el medidor",
      "Seguimos el expediente hasta que lo colocan",
    ],
  },
];

const FAQS = [
  {
    q: "¿Qué es el certificado DCI y por qué lo piden?",
    a: "Es la Declaración de Conformidad de Instalación: un documento firmado por un electricista matriculado que acredita que tu instalación cumple la norma de seguridad. La distribuidora lo pide para dar el alta de un medidor nuevo.",
  },
  {
    q: "¿Qué papeles necesito?",
    a: "DNI del titular y algo que acredite la tenencia del inmueble (escritura, boleto o contrato de alquiler). Si no tenés ninguno, existe una declaración jurada de domicilio y te decimos cómo se hace.",
  },
  {
    q: "¿Monofásico o trifásico? ¿Cuál necesito?",
    a: "Depende de la potencia que vas a usar. Lo definimos juntos en el presupuesto.",
  },
  {
    q: "No tengo pilar o el que tengo está viejo, ¿qué hago?",
    a: "Lo hacemos o lo adecuamos nosotros, dentro del mismo trabajo.",
  },
  {
    q: "¿Puedo pedir más de un medidor?",
    a: "Sí. Indicá cuántos en el formulario y lo incluimos en el presupuesto.",
  },
  {
    q: "¿Qué pasa si la distribuidora observa el trámite?",
    a: "Lo corregimos y volvemos a presentar. El seguimiento del expediente está incluido.",
  },
  {
    q: "¿Ustedes son la distribuidora?",
    a: "No. Somos un servicio independiente de electricista matriculado: hacemos la instalación, firmamos el DCI y presentamos el trámite ante la distribuidora que corresponda a tu domicilio.",
  },
  {
    q: "¿Trabajan en mi zona?",
    a: "Trabajamos en Zona Sur del GBA: Lomas de Zamora, Banfield, Temperley, Lanús, Avellaneda, Quilmes, Almirante Brown, Esteban Echeverría y Ezeiza. Si estás en otra localidad, consultanos.",
  },
];

function Landing() {
  const search = Route.useSearch();
  const variant = variantFromParam(search.tramite);
  const [localidad, setLocalidad] = useState<Localidad | "">("");
  const headline = headlineFor(search.tramite);

  function goToForm() {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant={variant} localidad={localidad} />

      <main>
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <img
            src={tablero1600}
            srcSet={`${tablero800} 800w, ${tablero1600} 1600w`}
            sizes="100vw"
            width={1600}
            height={1024}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="low"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
          />
          <div className="bg-hero-overlay absolute inset-0 -z-10" />

          <div className="mx-auto grid max-w-6xl gap-5 px-4 pt-4 pb-8 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-10 md:pt-12 md:pb-14">
            <div className="animate-fade-up">
              <h1 className="text-[1.55rem] leading-[1.15] font-extrabold tracking-tight text-foreground sm:text-4xl md:text-[2.6rem]">
                {headline}
              </h1>
              <p className="mt-2.5 text-[15px] leading-snug text-muted-foreground md:mt-4 md:text-lg">
                Hacemos la instalación y el pilar si hace falta, firmamos el DCI y presentamos el trámite de
                alta ante la distribuidora. Un solo trabajo, de punta a punta.
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5 md:mt-6 md:gap-2">
                {CHIPS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-card/90 px-2.5 py-1 text-xs font-semibold text-primary md:px-3 md:py-1.5 md:text-sm"
                  >
                    <Icon className="size-3.5 md:size-4" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div
              id="formulario"
              className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-raised [animation-delay:80ms] sm:p-6"
            >
              <LeadForm variant={variant} localidad={localidad} onLocalidadChange={setLocalidad} />
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section aria-labelledby="como-funciona" className="border-t border-border bg-surface py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="como-funciona" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Cómo funciona
            </h2>
            <ol className="mt-7 grid gap-0 md:grid-cols-4 md:gap-6">
              {STEPS.map(({ title, text }, i) => (
                <li key={title} className="relative flex gap-4 pb-7 last:pb-0 md:flex-col md:gap-3 md:pb-0">
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-10 bottom-0 left-5 w-px bg-primary/20 md:top-5 md:right-[-1.5rem] md:bottom-auto md:left-12 md:h-px md:w-auto"
                    />
                  )}
                  <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-4 ring-surface">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* QUÉ INCLUYE */}
        <section aria-labelledby="que-incluye" className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="que-incluye" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Qué incluye
            </h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Un solo trabajo, de punta a punta: instalación, certificado y trámite con el mismo matriculado.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
              {INCLUDES.map(({ icon: Icon, title, text, items }) => (
                <article key={title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
                      <Icon className="size-5 text-primary" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  </div>
                  {text && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{text}</p>}
                  {items.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[15px] leading-snug text-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent-blue" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq" className="border-t border-border bg-surface py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 id="faq" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Preguntas frecuentes
            </h2>
            <div className="mt-6 space-y-3">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="faq-item group rounded-xl border border-border bg-card shadow-card">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 text-[15px] font-semibold text-foreground md:p-5">
                    {q}
                    <ChevronDown
                      className="faq-chevron size-5 shrink-0 text-primary transition-transform"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="faq-body px-4 pb-4 text-[15px] leading-relaxed text-muted-foreground md:px-5 md:pb-5">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-4 py-14">
          <div className="bg-cta mx-auto max-w-6xl rounded-3xl px-6 py-10 text-center text-primary-foreground md:py-14">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Pedí el presupuesto de tu medidor nuevo</h2>
            <p className="mx-auto mt-2 max-w-xl text-[15px] opacity-90">
              Sin cargo. Mandanos una foto del frente por WhatsApp o completá el formulario.
            </p>
            <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={goToForm}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary-foreground px-6 text-base font-semibold text-primary transition-opacity hover:opacity-90 sm:flex-1"
              >
                Completar formulario
              </button>
              <WhatsAppLink
                ubicacion="cta_final"
                variant={variant}
                localidad={localidad}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground transition-colors hover:bg-whatsapp-strong sm:flex-1"
              >
                <WhatsAppIcon className="size-5" />
                Mandar foto por WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant={variant} localidad={localidad} />
      <MobileContactBar variant={variant} localidad={localidad} />
    </div>
  );
}
