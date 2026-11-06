import { describe, expect, it } from "vitest";
import { CANTIDADES, buildLeadMessage, headlineFor, leadSchema, normalizeArPhone, stepOneSchema, variantFromParam } from "@/lib/site";

describe("headline by ?tramite", () => {
  it("medidor", () => {
    expect(headlineFor("medidor")).toBe(
      "Electricista matriculado para tu medidor nuevo: instalación, DCI y trámite",
    );
  });
  it("dci", () => {
    expect(headlineFor("dci")).toBe("Electricista matriculado para tu certificado DCI y alta de medidor");
  });
  it("pilar", () => {
    expect(headlineFor("pilar")).toBe("Electricista matriculado para tu pilar de luz y medidor nuevo");
  });
  it("missing or unknown falls back to the generic headline", () => {
    expect(headlineFor(undefined)).toBe("Electricista matriculado: instalación, DCI y trámite de tu medidor nuevo");
    expect(headlineFor("otra-cosa")).toBe("Electricista matriculado: instalación, DCI y trámite de tu medidor nuevo");
    expect(variantFromParam("xyz")).toBe("general");
  });
});

describe("Argentine WhatsApp validation", () => {
  it("accepts common local formats", () => {
    expect(normalizeArPhone("11 2345-6789")).toBe("1123456789");
    expect(normalizeArPhone("+54 9 11 2345 6789")).toBe("1123456789");
    expect(normalizeArPhone("011 15 2345-6789")).toBe("1123456789");
    expect(normalizeArPhone("221 15 123-4567")).toBe("2211234567");
  });
  it("rejects incomplete or foreign numbers", () => {
    expect(normalizeArPhone("2345-6789")).toBeNull();
    expect(normalizeArPhone("15 2345 6789")).toBeNull();
    expect(normalizeArPhone("+1 415 555 0100")).toBeNull();
  });
});

describe("two-step form", () => {
  const stepOne = { conexion: "trifasico", uso: "local", cantidad: "mas-de-4", instalacion: "sin-pilar" };

  it("cantidad options are 1, 2, 3, 4 and Más de 4", () => {
    expect(CANTIDADES.map((o) => o.label)).toEqual(["1", "2", "3", "4", "Más de 4"]);
  });
  it("step 1 requires conexión, uso, cantidad and instalación", () => {
    expect(stepOneSchema.safeParse({ conexion: "", uso: "", cantidad: "", instalacion: "" }).success).toBe(false);
    expect(stepOneSchema.safeParse(stepOne).success).toBe(true);
  });
  it("calle y altura is optional", () => {
    const base = { ...stepOne, localidad: "Quilmes", nombre: "Ana", whatsapp: "11 2345 6789" };
    expect(leadSchema.safeParse(base).success).toBe(true);
    expect(leadSchema.safeParse({ ...base, whatsapp: "" }).success).toBe(false);
  });
});

describe("prefilled WhatsApp message", () => {
  it("follows the requested template", () => {
    expect(
      buildLeadMessage({
        conexion: "monofasico",
        uso: "vivienda",
        cantidad: "1",
        instalacion: "pilar-ok",
        localidad: "Lanús",
        nombre: " Ana ",
      }),
    ).toBe(
      "Hola Lautaro, necesito un medidor nuevo monofásico para vivienda, cantidad: 1, instalación: ya tengo pilar en condiciones, en Lanús. Mi nombre es Ana.",
    );
  });
  it("includes the street when given and 'Más de 4' as 'más de 4'", () => {
    const msg = buildLeadMessage({
      conexion: "trifasico",
      uso: "obra",
      cantidad: "mas-de-4",
      instalacion: "sin-pilar",
      localidad: "Quilmes",
      direccion: "Mitre 123",
      nombre: "Ana",
    });
    expect(msg).toContain("medidor nuevo trifásico para obra o terreno, cantidad: más de 4");
    expect(msg).toContain("en Mitre 123, Quilmes.");
  });
  it("adds campaign reference when gclid/utm are present", () => {
    const msg = buildLeadMessage({
      conexion: "no-se",
      uso: "vivienda",
      cantidad: "2",
      instalacion: "no-se",
      localidad: "Quilmes",
      nombre: "Ana",
      attribution: { utm_source: "google", utm_campaign: "dci", gclid: "abc" },
    });
    expect(msg).toContain("(Ref: google/dci · gclid abc)");
  });
});
