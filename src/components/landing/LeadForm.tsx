import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2 } from "lucide-react";
import {
  CANTIDADES,
  CONEXIONES,
  INSTALACIONES,
  LOCALIDADES,
  USOS,
  buildLeadMessage,
  stepOneSchema,
  stepTwoSchema,
  whatsappUrl,
  type Attribution,
  type Localidad,
  type Variant,
} from "@/lib/site";
import { captureAttribution, trackConversion } from "@/lib/tracking";
import { WhatsAppIcon } from "./icons";
import { WhatsAppLink } from "./contact";

type Props = {
  variant: Variant;
  localidad: Localidad | "";
  onLocalidadChange: (v: Localidad | "") => void;
};

type StepOneField = "conexion" | "uso" | "cantidad" | "instalacion";
type StepTwoField = "localidad" | "direccion" | "nombre" | "whatsapp";
type FieldErrors = Partial<Record<StepOneField | StepTwoField, string>>;

const ATTR_FIELDS = ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_term"] as const;
const STEP_ONE_ORDER: StepOneField[] = ["conexion", "uso", "cantidad", "instalacion"];
const STEP_TWO_ORDER: StepTwoField[] = ["localidad", "direccion", "nombre", "whatsapp"];

function collectErrors(issues: { path: (string | number)[]; message: string }[]): FieldErrors {
  const next: FieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0] as keyof FieldErrors;
    if (!next[key]) next[key] = issue.message;
  }
  return next;
}

export function LeadForm({ variant, localidad, onLocalidadChange }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [conexion, setConexion] = useState("");
  const [uso, setUso] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [instalacion, setInstalacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attribution, setAttribution] = useState<Attribution>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setAttribution(captureAttribution());
  }, []);

  function clearError(k: keyof FieldErrors) {
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  }

  function focusField(name: string) {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }

  function goNext() {
    const parsed = stepOneSchema.safeParse({ conexion, uso, cantidad, instalacion });
    if (!parsed.success) {
      const next = collectErrors(parsed.error.issues);
      setErrors(next);
      const first = STEP_ONE_ORDER.find((k) => next[k]);
      if (first) focusField(first);
      return;
    }
    setErrors({});
    setStep(2);
    window.setTimeout(() => focusField("localidad"), 30);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 1) return goNext();

    const one = stepOneSchema.safeParse({ conexion, uso, cantidad, instalacion });
    if (!one.success) {
      setStep(1);
      setErrors(collectErrors(one.error.issues));
      return;
    }
    const two = stepTwoSchema.safeParse({ localidad, direccion, nombre, whatsapp });
    if (!two.success) {
      const next = collectErrors(two.error.issues);
      setErrors(next);
      const first = STEP_TWO_ORDER.find((k) => next[k]);
      if (first) focusField(first);
      return;
    }
    setErrors({});
    const lead = { ...one.data, ...two.data };
    const url = whatsappUrl(buildLeadMessage({ ...lead, attribution }));
    trackConversion("form_submit", {
      variante: variant,
      conexion: lead.conexion,
      uso: lead.uso,
      cantidad: lead.cantidad,
      instalacion: lead.instalacion,
      localidad: lead.localidad,
    });
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
          Se abrió WhatsApp con tu mensaje listo. Envialo, sumá una foto del frente y te pasamos el presupuesto
          sin cargo.
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
          onClick={() => {
            setSentUrl(null);
            setStep(1);
          }}
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
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Pedir presupuesto de medidor nuevo">
      {ATTR_FIELDS.map((k) => (
        <input key={k} type="hidden" name={k} value={attribution[k] ?? ""} />
      ))}

      {/* Progress */}
      <div className="mb-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-bold text-foreground sm:text-base">
            {step === 1 ? "Contanos qué necesitás" : "¿Dónde es?"}
          </p>
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">Paso {step} de 2</span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-label="Progreso del formulario"
          aria-valuemin={1}
          aria-valuemax={2}
          aria-valuenow={step}
        >
          <div
            className="h-full rounded-full bg-accent-blue transition-[width] duration-500 ease-out"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {step === 1 ? (
        <div key="step1" className="animate-fade-up space-y-3.5">
          <ChoiceGroup legend="Tipo de conexión" name="conexion" error={errors.conexion} cols="grid-cols-3">
            {CONEXIONES.map((o) => {
              const [main, hint] = o.label.split(" (");
              return (
                <Choice key={o.value} name="conexion" value={o.value} checked={conexion === o.value} onChange={(v) => { setConexion(v); clearError("conexion"); }} invalid={!!errors.conexion}>
                  <span className="block font-semibold">{main}</span>
                  {hint && <span className="block text-[11px] leading-tight font-normal text-muted-foreground">{hint.replace(")", "")}</span>}
                </Choice>
              );
            })}
          </ChoiceGroup>

          <ChoiceGroup legend="Uso" name="uso" error={errors.uso} cols="grid-cols-2 sm:grid-cols-4">
            {USOS.map((o) => (
              <Choice key={o.value} name="uso" value={o.value} checked={uso === o.value} onChange={(v) => { setUso(v); clearError("uso"); }} invalid={!!errors.uso}>
                <span className="font-semibold">{o.label}</span>
              </Choice>
            ))}
          </ChoiceGroup>

          <ChoiceGroup
            legend="Cantidad de medidores"
            hint="Si es un edificio o varias unidades, indicá cuántos"
            name="cantidad"
            error={errors.cantidad}
            cols="grid-cols-6"
          >
            {CANTIDADES.map((o) => (
              <Choice key={o.value} name="cantidad" value={o.value} checked={cantidad === o.value} onChange={(v) => { setCantidad(v); clearError("cantidad"); }} invalid={!!errors.cantidad} compact>
                <span className="font-semibold">{o.label}</span>
              </Choice>
            ))}
          </ChoiceGroup>

          <ChoiceGroup legend="¿Cómo está tu instalación?" name="instalacion" error={errors.instalacion} cols="grid-cols-1 sm:grid-cols-2">
            {INSTALACIONES.map((o) => (
              <Choice key={o.value} name="instalacion" value={o.value} checked={instalacion === o.value} onChange={(v) => { setInstalacion(v); clearError("instalacion"); }} invalid={!!errors.instalacion} align="left">
                <span className="font-medium">{o.label}</span>
              </Choice>
            ))}
          </ChoiceGroup>
        </div>
      ) : (
        <div key="step2" className="animate-fade-up grid grid-cols-2 gap-x-2.5 gap-y-3">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="localidad" className={labelCls}>
              Localidad
            </label>
            <select
              id="localidad"
              name="localidad"
              className="field"
              value={localidad}
              onChange={(e) => { onLocalidadChange(e.target.value as Localidad | ""); clearError("localidad"); }}
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

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="direccion" className={labelCls}>
              Calle y altura <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              autoComplete="street-address"
              maxLength={80}
              placeholder="Ej: Av. Hipólito Yrigoyen 1234"
              className="field"
              value={direccion}
              onChange={(e) => { setDireccion(e.target.value); clearError("direccion"); }}
              aria-invalid={!!errors.direccion}
              aria-describedby={errors.direccion ? "direccion-error" : undefined}
            />
            {err("direccion")}
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
              onChange={(e) => { setNombre(e.target.value); clearError("nombre"); }}
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
              onChange={(e) => { setWhatsapp(e.target.value); clearError("whatsapp"); }}
              aria-invalid={!!errors.whatsapp}
              aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            />
            {err("whatsapp")}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {step === 2 && (
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setStep(1);
            }}
            aria-label="Volver al paso 1"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-input bg-card text-primary transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary-strong"
        >
          {step === 1 ? "Continuar" : "Pedir presupuesto"}
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-2.5 flex items-start justify-center gap-1.5 text-center text-xs leading-snug text-muted-foreground">
        <Camera className="mt-px size-3.5 shrink-0 text-primary" aria-hidden="true" />
        Mandanos una foto del frente por WhatsApp y te pasamos el presupuesto sin cargo.
      </p>

      <WhatsAppLink
        ubicacion="formulario"
        variant={variant}
        localidad={localidad}
        className="mt-2.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-whatsapp/40 bg-card px-5 text-[15px] font-semibold text-whatsapp-strong transition-colors hover:bg-success-soft"
      >
        <WhatsAppIcon className="size-5" />
        Mandar foto por WhatsApp
      </WhatsAppLink>
    </form>
  );
}

function ChoiceGroup({
  legend,
  hint,
  name,
  error,
  cols,
  children,
}: {
  legend: string;
  hint?: string;
  name: string;
  error?: string | undefined;
  cols: string;
  children: ReactNode;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}>
      <legend className="mb-1 block text-[13px] font-semibold text-foreground">{legend}</legend>
      {hint && (
        <p id={`${name}-hint`} className="-mt-0.5 mb-1.5 text-[11px] text-muted-foreground">
          {hint}
        </p>
      )}
      <div className={`grid gap-1.5 ${cols}`}>{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Choice({
  name,
  value,
  checked,
  onChange,
  invalid,
  compact,
  align = "center",
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  invalid: boolean;
  compact?: boolean;
  align?: "center" | "left";
  children: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center rounded-lg border bg-card text-sm leading-tight text-foreground transition-colors select-none hover:border-accent-blue/60 has-checked:border-accent-blue has-checked:bg-secondary has-checked:text-primary has-checked:ring-1 has-checked:ring-accent-blue has-focus-visible:ring-2 has-focus-visible:ring-accent-blue/40 ${
        align === "center" ? "justify-center text-center" : "text-left"
      } ${compact ? "h-11 px-1" : "min-h-11 px-2.5 py-2"} ${invalid ? "border-destructive/60" : "border-input"}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span>{children}</span>
    </label>
  );
}
