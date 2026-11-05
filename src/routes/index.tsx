import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  BadgeCheck,
  Camera,
  ChevronDown,
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  Home,
  IdCard,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Zap,
} from "lucide-react";
import tablero1600 from "@/assets/tablero-1600.webp";
import tablero800 from "@/assets/tablero-800.webp";
import { LeadForm } from "@/components/landing/LeadForm";
import { MobileContactBar, SiteFooter, SiteHeader } from "@/components/landing/chrome";
import { WhatsAppLink } from "@/components/landing/contact";
import { WhatsAppIcon } from "@/components/landing/icons";
import {
  LANDING_NOINDEX,
  headlineFor,
  tramiteFromParam,
  type Localidad,
  type TramiteValue,
} from "@/lib/site";

const searchSchema = z.object({
  tramite: z.string().optional().catch(undefined),
});

const TITLE = "Medidor nuevo y certificado DCI | Electricista matriculado Zona Sur";
const DESCRIPTION =
  "Electricista matriculado (Mat. T3-47970) en Zona Sur, GBA. Instalación, certificado DCI y gestión del medidor nuevo. Iniciá tu trámite por WhatsApp.";

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
  { icon: ClipboardList, title: "Dejás tus datos", text: "Completás el formulario o nos escribís por WhatsApp." },
  { icon: PhoneCall, title: "Te contactamos y coordinamos visita", text: "Revisamos tu caso y acordamos día y horario." },
  { icon: Zap, title: "Instalación y certificado DCI", text: "Dejamos la instalación bajo norma y firmamos el DCI." },
  { icon: FileCheck2, title: "Gestión del medidor", text: "Presentamos el trámite del medidor ante la distribuidora." },
];

const NEEDS = [
  { icon: IdCard, text: "DNI del titular" },
  { icon: FileText, text: "Título de propiedad o comprobante de tenencia" },
  { icon: MapPin, text: "Dirección exacta del inmueble" },
  { icon: Camera, text: "Fotos del frente y del lugar del medidor (si las tenés)" },
];

const SERVICE_CARDS: { value: TramiteValue; icon: typeof Gauge; title: string; text: string }[] = [
  {
    value: "medidor",
    icon: Gauge,
    title: "Medidor nuevo",
    text: "Preparamos la instalación y gestionamos el pedido del medidor.",
  },
  {
    value: "dci",
    icon: FileCheck2,
    title: "Certificado DCI",
    text: "Revisamos tu instalación y emitimos la declaración firmada.",
  },
  {
    value: "desde-cero",
    icon: Home,
    title: "Instalación completa desde cero",
    text: "Pilar, tablero y circuitos nuevos, listos para conectar.",
  },
];

const FAQS = [
  {
    q: "¿Qué es el certificado DCI?",
    a: "Es la Declaración de Conformidad de Instalación eléctrica: un documento firmado por un electricista matriculado que acredita que tu instalación cumple las normas de seguridad. La distribuidora lo pide para conectar un medidor nuevo.",
  },
  {
    q: "¿Puedo pedir el medidor sin tener la instalación hecha?",
    a: "No. Para colocar el medidor, la instalación tiene que estar hecha y certificada. Si todavía no la tenés, la hacemos desde cero y después gestionamos el medidor.",
  },
  {
    q: "¿Trabajan en mi zona?",
    a: "Trabajamos en Zona Sur del GBA: Lomas de Zamora, Banfield, Temperley, Lanús, Avellaneda, Quilmes, Almirante Brown, Esteban Echeverría y Ezeiza. Si estás en otra localidad, consultanos.",
  },
  {
    q: "¿Qué pasa si mi instalación no cumple la norma?",
    a: "En la visita revisamos todo y te decimos qué hay que adecuar. Hacemos las correcciones necesarias y recién ahí emitimos el certificado DCI.",
  },
  {
    q: "¿Ustedes son la distribuidora?",
    a: "No. Somos un servicio independiente de electricista matriculado. Te ayudamos con la instalación, el certificado y la presentación del trámite ante la distribuidora que corresponda a tu domicilio.",
  },
];

function Landing() {
  const search = Route.useSearch();
  const [tramite, setTramite] = useState<TramiteValue | "">(() => tramiteFromParam(search.tramite));
  const [localidad, setLocalidad] = useState<Localidad | "">("");
  const headline = headlineFor(search.tramite);

  function chooseService(value: TramiteValue) {
    setTramite(value);
    const target = document.getElementById("formulario");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      document.getElementById("localidad")?.focus({ preventScroll: true });
    }, 450);
  }

  function goToForm() {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader tramite={tramite} localidad={localidad} />

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

          <div className="mx-auto grid max-w-6xl gap-5 px-4 pt-4 pb-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10 md:pt-14 md:pb-16">
            <div className="animate-fade-up">
              <h1 className="text-[1.6rem] leading-[1.15] font-extrabold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
                {headline}
              </h1>
              <p className="mt-2.5 text-[15px] leading-snug text-muted-foreground md:mt-4 md:text-lg">
                Nos encargamos de la instalación, el certificado DCI y el trámite del medidor. Zona Sur, GBA.
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
              <p className="mb-3 text-sm font-bold text-foreground sm:text-base">
                Iniciá tu trámite en 1 minuto
              </p>
              <LeadForm
                tramite={tramite}
                onTramiteChange={setTramite}
                localidad={localidad}
                onLocalidadChange={setLocalidad}
              />
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
              {STEPS.map(({ icon: Icon, title, text }, i) => (
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
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                      <Icon className="size-4 text-accent-blue" aria-hidden="true" />
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* QUÉ NECESITÁS */}
        <section aria-labelledby="que-necesitas" className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="que-necesitas" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Qué necesitás tener a mano
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {NEEDS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] font-medium text-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* QUÉ TRÁMITE */}
        <section aria-labelledby="que-tramite" className="border-t border-border bg-surface py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="que-tramite" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Qué trámite necesitás
            </h2>
            <p className="mt-2 text-[15px] text-muted-foreground">Tocá una opción y completá tus datos.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
              {SERVICE_CARDS.map(({ value, icon: Icon, title, text }) => {
                const active = tramite === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => chooseService(value)}
                    aria-pressed={active}
                    className={`group flex items-start gap-4 rounded-2xl border bg-card p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-blue/60 hover:shadow-raised md:flex-col ${
                      active ? "border-accent-blue ring-2 ring-accent-blue/25" : "border-border"
                    }`}
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary">
                      <Icon
                        className="size-6 text-primary transition-colors group-hover:text-primary-foreground"
                        aria-hidden="true"
                      />
                    </span>
                    <span>
                      <span className="block text-lg font-semibold text-foreground">{title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{text}</span>
                      <span className="mt-3 inline-block text-sm font-semibold text-accent-blue">
                        Elegir este trámite →
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq" className="py-12 md:py-16">
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
        <section className="px-4 pb-14">
          <div className="bg-cta mx-auto max-w-6xl rounded-3xl px-6 py-10 text-center text-primary-foreground md:py-14">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Iniciá hoy el trámite de tu medidor</h2>
            <p className="mx-auto mt-2 max-w-xl text-[15px] opacity-90">
              Dejanos tus datos o escribinos directo. Te respondemos por WhatsApp.
            </p>
            <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={goToForm}
                className="inline-flex h-12 items-center sm:flex-1 justify-center rounded-xl bg-primary-foreground px-6 text-base font-semibold text-primary transition-opacity hover:opacity-90"
              >
                Iniciar mi trámite
              </button>
              <WhatsAppLink
                ubicacion="cta_final"
                tramite={tramite}
                localidad={localidad}
                className="inline-flex h-12 items-center sm:flex-1 justify-center gap-2 rounded-xl bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground transition-colors hover:bg-whatsapp-strong"
              >
                <WhatsAppIcon className="size-5" />
                Hablar por WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter tramite={tramite} localidad={localidad} />
      <MobileContactBar tramite={tramite} localidad={localidad} />
    </div>
  );
}
