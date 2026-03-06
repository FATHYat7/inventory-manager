"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const sizes: Record<Size, string> = {
    sm: "h-8 rounded-lg px-3 text-xs",
    md: "h-10 rounded-xl px-4 text-sm",
  };

  const variants: Record<Variant, string> = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary:
      "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    ghost: "text-zinc-700 hover:bg-zinc-100",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

