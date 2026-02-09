"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

function classesFor(variant: Variant, disabled?: boolean) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-foreground/30";

  const variants: Record<Variant, string> = {
    primary: "bg-foreground text-background",
    secondary: "border border-foreground/20 bg-background text-foreground",
    ghost: "bg-transparent text-foreground underline-offset-4 hover:underline",
  };

  const state = disabled ? "opacity-60" : "hover:opacity-90";
  return `${base} ${variants[variant]} ${state}`;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className = "", disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${classesFor(variant, disabled)} ${className}`}
      {...props}
    />
  );
});
