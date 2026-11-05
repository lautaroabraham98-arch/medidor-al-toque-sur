import type { AnchorHTMLAttributes, ReactNode } from "react";
import { BUSINESS, buildGenericMessage, whatsappUrl, type TramiteValue } from "@/lib/site";
import { trackConversion } from "@/lib/tracking";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  ubicacion: string;
  tramite?: TramiteValue | "" | undefined;
  localidad?: string | undefined;
};

export function WhatsAppLink({ children, ubicacion, tramite, localidad, onClick, ...rest }: LinkProps) {
  return (
    <a
      href={whatsappUrl(buildGenericMessage(tramite))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        trackConversion("whatsapp_click", { tramite: tramite || undefined, localidad, ubicacion });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function PhoneLink({ children, ubicacion, tramite, localidad, onClick, ...rest }: LinkProps) {
  return (
    <a
      href={BUSINESS.phoneHref}
      onClick={(e) => {
        trackConversion("phone_click", { tramite: tramite || undefined, localidad, ubicacion });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
