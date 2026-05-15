import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  interactive?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function SurfaceCard<T extends ElementType = "div">({
  as,
  children,
  interactive,
  className,
  ...props
}: SurfaceCardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn("surface-card", interactive && "surface-card-hover", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
