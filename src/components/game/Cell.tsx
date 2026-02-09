"use client";

import { type ButtonHTMLAttributes } from "react";
import type { CellValue } from "@/lib/gameModel";

export function Cell(
  props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
    value: CellValue;
    highlight?: boolean;
  },
) {
  const { value, highlight, className = "", ...rest } = props;

  const valueClassName =
    value === "X"
      ? "cellValue cellValueX"
      : value === "O"
        ? "cellValue cellValueO"
        : "cellValue";

  return (
    <button
      type="button"
      className={[
        "grid place-items-center",
        "w-20 h-20 md:w-24 md:h-24",
        "rounded-xl border-2",
        highlight
          ? "bg-green-100/70 border-green-700/30 shadow animate-pulse"
          : "bg-white/70 shadow-sm",
        "transition-transform",
        "enabled:hover:shadow enabled:active:translate-y-0.5",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span
        className={[
          valueClassName,
          "text-4xl md:text-5xl font-extrabold leading-none",
        ].join(" ")}
      >
        {value ?? ""}
      </span>
    </button>
  );
}
