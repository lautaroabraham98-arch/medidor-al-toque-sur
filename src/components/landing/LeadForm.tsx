import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import {
  LOCALIDADES,
  TRAMITES,
  buildLeadMessage,
  leadSchema,
  whatsappUrl,
  type Attribution,
  type Localidad,
  type TramiteValue,
} from "@/lib/site";
import { captureAttribution, trackConversion } from "@/lib/tracking";
import { WhatsAppIcon } from "./icons";
import { WhatsAppLink } from "./contact";

type Props = {
  tramite: TramiteValue | "";
  onTramiteChange: (v: TramiteValue | "") => void;
  localidad: Localidad | "";
  onLocalidadChange: (v: Localidad | "") => void;
};

type FieldErrors = Partial<Record<"tramite" | "localidad" | "nombre" | "whatsapp", string>>;

const ATTR_FIELDS = ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_term"] as const;

export function LeadForm({ tramite, onTramiteChange, localidad, onLocalidadChange }: Props) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attribution, setAttribution] = useState<Attribution>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setAttribution(captureAttribution());
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = leadSchema.safeParse({ tramite, localidad, nombre, whatsapp });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = (["tramite", "localidad", "nombre", "whatsapp"] as const).find((k) => next[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    const url = whatsappUrl(buildLeadMessage({ ...parsed.data, attribution }));
    trackConversion("form_submit", { tramite: parsed.data.tramite, localidad: parsed.data.localidad });
    window.open(url, "_blank", "noopener");
    setSentUrl(url);
  }

  if (sentUrl) {
    return (
      <div role="status" className="animate-pop py-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">¡Listo! Te escribimos por WhatsApp</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Se abrió WhatsApp con tu mensaje listo. Envialo y te respondemos para coordinar la visita.
        </p>
        <a
          href={sentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 text-[15px] font-semibold text-whatsapp-foreground transition-colors hover:bg-whatsapp-strong"
        >
          <WhatsAppIcon className="size-5" />
          ¿No se abrió? Abrir WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setSentUrl(null)}
          className="mt-3 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Volver al formulario
        </button>
      </div>
    );
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1 text-xs font-medium text-destructive">
        {errors[k]}
      </p>
    ) : null;

  const labelCls = "mb-1 block text-[13px] font-semibold text-foreground";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Iniciar trámite">
      {ATTR_FIELDS.map((k) => (
        <input key={k} type="hidden" name={k} value={attribution[k] ?? ""} />
      ))}

      <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="tramite" className={labelCls}>
            Tipo de trámite
          </label>
          <select
            id="tramite"
            name="tramite"
            className="field"
            value={tramite}
            onChange={(e) => onTramiteChange(e.target.value as TramiteValue | "")}
            aria-invalid={!!errors.tramite}
            aria-describedby={errors.tramite ? "tramite-error" : undefined}
          >
            <option value="" disabled>
              Elegí una opción
            </option>
            {TRAMITES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {err("tramite")}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="localidad" className={labelCls}>
            Localidad
          </label>
          <select
            id="localidad"
            name="localidad"
            className="field"
            value={localidad}
            onChange={(e) => onLocalidadChange(e.target.value as Localidad | "")}
            aria-invalid={!!errors.localidad}
            aria-describedby={errors.localidad ? "localidad-error" : undefined}
          >
            <option value="" disabled>
              Elegí tu localidad
            </option>
            {LOCALIDADES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          {err("localidad")}
        </div>

        <div>
          <label htmlFor="nombre" className={labelCls}>
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="given-name"
            maxLength={60}
            placeholder="Tu nombre"
            className="field"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? "nombre-error" : undefined}
          />
          {err("nombre")}
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelCls}>
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={25}
            placeholder="11 2345-6789"
            className="field"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
          />
          {err("whatsapp")}
        </div>
      </div>

      <button
        type="submit"
        className="group mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary-strong"
      >
        Iniciar mi trámite
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>

      <WhatsAppLink
        ubicacion="formulario"
        tramite={tramite}
        localidad={localidad}
        className="mt-2.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-whatsapp/40 bg-card px-5 text-[15px] font-semibold text-whatsapp-strong transition-colors hover:bg-success-soft"
      >
        <WhatsAppIcon className="size-5" />
        Hablar por WhatsApp
      </WhatsAppLink>

      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <Lock className="size-3" aria-hidden="true" />
        Usamos tus datos solo para contactarte por este trámite.
      </p>
    </form>
  );
}
