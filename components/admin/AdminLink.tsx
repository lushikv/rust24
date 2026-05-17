import type { AnchorHTMLAttributes, ReactNode } from "react";

type AdminLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

export function AdminLink({ href, children, ...props }: AdminLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
