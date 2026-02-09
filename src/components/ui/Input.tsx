"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`h-11 w-full rounded-md border border-foreground/20 bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-foreground/30 ${className}`}
      {...props}
    />
  );
});
