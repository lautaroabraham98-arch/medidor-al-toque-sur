# Medidor Al Toque Sur

Creá una landing page de conversión para Google Ads, mobile-first, en español rioplatense (Argentina), para un electricista matriculado: Lautaro Abraham, Matrícula T3-47970, Zona Sur de Buenos Aires. Objetivo ÚNICO: que la persona pida un MEDIDOR NUEVO y/o el CERTIFICADO DCI y envíe el formulario o contacte por WhatsApp/llamada. Tráfico: búsquedas de Google con intención alta, así que la página debe ser corta, rápida y sin distracciones.

ESTILO

- Aspecto de portal de trámites online: limpio, institucional, mucho blanco, tipografía Inter o Poppins, bordes redondeados suaves, íconos simples.

- Paleta: azul #1E4B9C principal, #2F6FE4 acento, grises claros, texto casi negro.

- NO usar logo, nombre ni colores exactos de Edesur ni de ninguna distribuidora. No debe sugerir que es un sitio oficial.

- Referencia visual: las imágenes adjuntas (rayo azul como isotipo, foto de tablero de fondo con opacidad baja). No copiar sus textos.

ESTRUCTURA (una sola página)

1. Header simple y fijo: isotipo + "Electricista Matriculado · Zona Sur", botón "Llamar" (tel:+541128803482) y botón "WhatsApp". Sin menú de navegación.

2. Hero (todo visible sin scrollear en mobile):

   - Titular dinámico según el parámetro de URL "tramite":

     · tramite=medidor → "Pedí tu medidor nuevo con un electricista matriculado"

     · tramite=dci → "Certificado DCI para tu medidor, con electricista matriculado"

     · sin parámetro o cualquier otro → "Medidor nuevo y certificado DCI con electricista matriculado"

   - Subtítulo: "Nos encargamos de la instalación, el certificado DCI y el trámite del medidor. Zona Sur, GBA."

   - Formulario corto al lado/abajo (ver más abajo) + botón secundario "Hablar por WhatsApp".

   - Chips: "Matriculado T3-47970", "Zona Sur GBA", "Instalación bajo norma".

3. "Cómo funciona" en 4 pasos tipo stepper: 1) Dejás tus datos, 2) Te contactamos y coordinamos visita, 3) Instalación y certificado DCI, 4) Gestión del medidor con la distribuidora.

4. "Qué necesitás tener a mano": DNI, título de propiedad o comprobante de tenencia, dirección exacta, fotos del frente y del lugar del medidor (si las tenés).

5. "Qué trámite necesitás" en 3 cards: Medidor nuevo / Certificado DCI / Instalación completa desde cero. Al tocar una, preselecciona esa opción en el formulario y scrollea a él.

6. FAQ en acordeón (4 a 5 preguntas, respuestas breves, sin precios ni plazos exactos): ¿Qué es el certificado DCI? ¿Puedo pedir el medidor sin tener la instalación hecha? ¿Trabajan en mi zona? ¿Qué pasa si mi instalación no cumple la norma?

7. CTA final repetido (formulario corto o botón WhatsApp).

8. Footer: "Lautaro Abraham · Electricista Matriculado · Matrícula T3-47970 · Zona Sur, Buenos Aires" + teléfono 11 2880-3482 + aviso legal visible: "Servicio independiente de electricista matriculado. No somos una distribuidora eléctrica ni un organismo oficial. Los nombres de empresas distribuidoras se mencionan solo a modo informativo." Links a "Política de privacidad" (página simple).

FORMULARIO CORTO (hero)

- Campos: tipo de trámite (select: medidor nuevo / certificado DCI / ambos / instalación desde cero), localidad (select: Lomas de Zamora, Banfield, Lanús, Avellaneda, Quilmes, Almirante Brown, Esteban Echeverría, Ezeiza, Temperley, Otra), nombre, WhatsApp (validar formato argentino).

- Botón: "Iniciar mi trámite".

- Al enviar: validar, disparar el evento de conversión, abrir wa.me/5491128803482 con mensaje prellenado ("Hola Lautaro, quiero iniciar el trámite de [trámite] en [localidad]. Mi nombre es [nombre]."), y mostrar pantalla "¡Listo! Te escribimos por WhatsApp".

- Dejar un campo oculto para guardar gclid y los parámetros utm_source, utm_medium, utm_campaign, utm_term, y que se incluyan en el envío.

TRACKING (Google Ads)

- Incluir Google tag (gtag.js) con placeholder "AW-XXXXXXXXXX".

- Eventos de conversión con placeholders de label: 

  · form_submit (envío de formulario)

  · whatsapp_click (cualquier botón o botón flotante de WhatsApp)

  · phone_click (click en tel:)

- Pasar el valor de "tramite" y "localidad" como parámetros del evento.

EXTRAS

- Botón flotante de WhatsApp en mobile.

- Barra inferior fija en mobile con "Llamar" y "WhatsApp".

- Carga muy rápida (imágenes WebP optimizadas, lazy loading), puntuación alta en Core Web Vitals.

- Meta tags SEO, título y description coherentes con el tema, y noindex opcional para la landing.

- Accesible: contraste alto, labels en inputs. Textos con tilde correctos ("Pedí", "Matrícula").

- Animaciones sutiles, nada recargado.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://medidor-al-toque-sur.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cac86530-9524-4ca6-b211-e8daf182e805).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
