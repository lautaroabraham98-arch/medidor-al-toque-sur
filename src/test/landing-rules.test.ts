import { describe, expect, it } from "vitest";
import { buildLeadMessage, headlineFor, leadSchema, normalizeArPhone, tramiteFromParam } from "@/lib/site";

describe("headline by ?tramite", () => {
  it("medidor", () => {
    expect(headlineFor("medidor")).toBe("Pedí tu medidor nuevo con un electricista matriculado");
  });
  it("dci", () => {
    expect(headlineFor("dci")).toBe("Certificado DCI para tu medidor, con electricista matriculado");
  });
  it("missing or unknown falls back to the generic headline", () => {
    expect(headlineFor(undefined)).toBe("Medidor nuevo y certificado DCI con electricista matriculado");
    expect(headlineFor("otra-cosa")).toBe("Medidor nuevo y certificado DCI con electricista matriculado");
  });
  it("preselects the form option only for medidor/dci", () => {
    expect(tramiteFromParam("dci")).toBe("dci");
    expect(tramiteFromParam("xyz")).toBe("");
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
  it("form schema requires every field", () => {
    expect(leadSchema.safeParse({ tramite: "", localidad: "", nombre: "", whatsapp: "" }).success).toBe(false);
    expect(
      leadSchema.safeParse({ tramite: "dci", localidad: "Quilmes", nombre: "Ana", whatsapp: "11 2345 6789" })
        .success,
    ).toBe(true);
  });
});

describe("prefilled WhatsApp message", () => {
  it("follows the requested template", () => {
    expect(buildLeadMessage({ tramite: "medidor", localidad: "Lanús", nombre: " Ana " })).toBe(
      "Hola Lautaro, quiero iniciar el trámite de medidor nuevo en Lanús. Mi nombre es Ana.",
    );
  });
  it("adds campaign reference when gclid/utm are present", () => {
    const msg = buildLeadMessage({
      tramite: "dci",
      localidad: "Quilmes",
      nombre: "Ana",
      attribution: { utm_source: "google", utm_campaign: "dci", gclid: "abc" },
    });
    expect(msg).toContain("(Ref: google/dci · gclid abc)");
  });
});
