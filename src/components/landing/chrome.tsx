import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { BUSINESS, type Variant } from "@/lib/site";
import { Isotipo, WhatsAppIcon } from "./icons";
import { PhoneLink, WhatsAppLink } from "./contact";

type Ctx = { variant?: Variant | undefined; localidad?: string | undefined };

export function SiteHeader({ variant, localidad }: Ctx) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Inicio">
          <Isotipo className="size-8 shrink-0 sm:size-9" />
          <span className="min-w-0 text-[13px] leading-tight font-semibold text-foreground sm:text-sm">
            Electricista Matriculado
            <span className="text-muted-foreground"> · </span>
            <span className="text-primary">Zona Sur</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <PhoneLink
            ubicacion="header"
            variant={variant}
            localidad={localidad}
            aria-label={`Llamar al ${BUSINESS.phoneDisplay}`}
            className="inline-flex size-10 items-center justify-center gap-2 rounded-full border border-input bg-card text-sm font-semibold text-primary transition-colors hover:bg-secondary sm:h-10 sm:w-auto sm:px-4"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Llamar</span>
          </PhoneLink>
          <WhatsAppLink
            ubicacion="header"
            variant={variant}
            localidad={localidad}
            aria-label="Escribir por WhatsApp"
            className="inline-flex size-10 items-center justify-center gap-2 rounded-full bg-whatsapp text-sm font-semibold text-whatsapp-foreground transition-colors hover:bg-whatsapp-strong sm:h-10 sm:w-auto sm:px-4"
          >
            <WhatsAppIcon className="size-[18px]" />
            <span className="sr-only sm:not-sr-only">WhatsApp</span>
          </WhatsAppLink>
        </div>
      </div>
    </header>
  );
}

export function MobileContactBar({ variant, localidad }: Ctx) {
  // The floating button appears once the visitor scrolls past the hero form.
  const [showFloat, setShowFloat] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowFloat(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <WhatsAppLink
        ubicacion="flotante"
        variant={variant}
        localidad={localidad}
        aria-label="Abrir chat de WhatsApp"
        tabIndex={showFloat ? 0 : -1}
        aria-hidden={!showFloat}
        className={`fixed right-4 bottom-[84px] z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-float transition-all duration-300 hover:scale-105 md:right-6 md:bottom-6 ${
          showFloat ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <WhatsAppIcon className="size-7" />
      </WhatsAppLink>

      <nav
        aria-label="Contacto rápido"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
      >
        <div className="grid grid-cols-2 gap-2">
          <PhoneLink
            ubicacion="barra_inferior"
            variant={variant}
            localidad={localidad}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-secondary text-[15px] font-semibold text-primary active:scale-[0.98]"
          >
            <Phone className="size-[18px]" aria-hidden="true" />
            Llamar
          </PhoneLink>
          <WhatsAppLink
            ubicacion="barra_inferior"
            variant={variant}
            localidad={localidad}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp text-[15px] font-semibold text-whatsapp-foreground active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            WhatsApp
          </WhatsAppLink>
        </div>
      </nav>
    </>
  );
}

export function SiteFooter({ variant, localidad }: Ctx) {
  return (
    <footer className="border-t border-border bg-surface pb-28 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <Isotipo className="size-9 shrink-0" />
            <p className="text-sm leading-relaxed text-foreground">
              <strong className="font-semibold">{BUSINESS.name}</strong> · {BUSINESS.title} · Matrícula{" "}
              {BUSINESS.matricula} · {BUSINESS.zone}
              <br />
              <PhoneLink
                ubicacion="footer"
                variant={variant}
                localidad={localidad}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Tel. {BUSINESS.phoneDisplay}
              </PhoneLink>
            </p>
          </div>
          <Link
            to="/privacidad"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Política de privacidad
          </Link>
        </div>
        <p className="mt-6 rounded-lg border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          Servicio independiente de electricista matriculado. No somos una distribuidora eléctrica ni un
          organismo oficial. Los nombres de empresas distribuidoras se mencionan solo a modo informativo.
        </p>
      </div>
    </footer>
  );
}
