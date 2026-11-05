import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileContactBar, SiteFooter, SiteHeader } from "@/components/landing/chrome";
import { BUSINESS } from "@/lib/site";

const TITLE = "Política de privacidad | Lautaro Abraham, electricista matriculado";
const DESCRIPTION =
  "Cómo usamos los datos que dejás en el formulario y qué mediciones de Google Ads usa este sitio.";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacidad,
});

function Privacidad() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <Link to="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          ← Volver al inicio
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Política de privacidad</h1>
        <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
          <section>
            <h2>Quién es responsable</h2>
            <p>
              {BUSINESS.name}, {BUSINESS.title} (Matrícula {BUSINESS.matricula}), {BUSINESS.zone}. Contacto:{" "}
              {BUSINESS.phoneDisplay}.
            </p>
          </section>
          <section>
            <h2>Qué datos pedimos y para qué</h2>
            <p>
              En el formulario pedimos datos del trabajo (tipo de conexión, uso, cantidad de medidores y estado
              de la instalación), localidad, calle y altura (opcional), nombre y número de WhatsApp. Los usamos
              únicamente para responderte y pasarte el presupuesto que pediste. Este sitio no guarda esos datos
              en un servidor: al enviar el formulario se abre WhatsApp con tu mensaje para que vos lo envíes.
              WhatsApp (Meta) trata esa conversación según sus propias políticas.
            </p>
          </section>
          <section>
            <h2>Medición de anuncios (Google Ads)</h2>
            <p>
              Usamos la etiqueta de Google Ads (Google LLC) para medir visitas que llegan desde anuncios y
              acciones como enviar el formulario, tocar WhatsApp o llamar. Para eso Google puede usar cookies y
              recibe datos técnicos (identificador del clic en el anuncio, página visitada, datos del trabajo y
              localidad elegidos, y parámetros de la campaña). No enviamos a Google tu nombre ni tu número.
              La finalidad es medir resultados y mejorar los anuncios.
            </p>
            <p className="mt-2">
              Si tu navegador envía la señal Global Privacy Control, o si visitás el sitio desde una región
              donde se requiere consentimiento previo (Unión Europea, Reino Unido y Suiza), la etiqueta no se
              carga.
            </p>
          </section>
          <section>
            <h2>Cómo desactivar la medición</h2>
            <p>
              Podés bloquear o borrar cookies desde tu navegador, activar Global Privacy Control, o gestionar
              la personalización de anuncios en{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                la configuración de anuncios de Google
              </a>
              .
            </p>
          </section>
          <section>
            <h2>Tus derechos</h2>
            <p>
              Podés pedir acceso, rectificación o eliminación de tus datos escribiéndonos por WhatsApp o
              llamando al {BUSINESS.phoneDisplay} (Ley 25.326 de Protección de Datos Personales). La Agencia
              de Acceso a la Información Pública es el organismo de control.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
      <MobileContactBar />
    </div>
  );
}
