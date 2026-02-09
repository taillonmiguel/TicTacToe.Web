"use client";

import { type ReactNode } from "react";

export function Modal(props: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!props.open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={props.title}
      onMouseDown={props.onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-foreground/10 bg-background p-5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-base font-semibold">{props.title}</div>
        {props.children}
      </div>
    </div>
  );
}
