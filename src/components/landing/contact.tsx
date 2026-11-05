import type { AnchorHTMLAttributes, ReactNode } from "react";
import { BUSINESS, buildGenericMessage, whatsappUrl, type Variant } from "@/lib/site";
import { trackConversion } from "@/lib/tracking";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  ubicacion: string;
  variant?: Variant | undefined;
  localidad?: string | undefined;
};

export function WhatsAppLink({ children, ubicacion, variant, localidad, onClick, ...rest }: LinkProps) {
  return (
    <a
      href={whatsappUrl(buildGenericMessage(variant))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        trackConversion("whatsapp_click", { variante: variant, localidad, ubicacion });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function PhoneLink({ children, ubicacion, variant, localidad, onClick, ...rest }: LinkProps) {
  return (
    <a
      href={BUSINESS.phoneHref}
      onClick={(e) => {
        trackConversion("phone_click", { variante: variant, localidad, ubicacion });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
