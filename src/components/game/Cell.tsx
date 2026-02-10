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
        "w-full aspect-square",
        "p-[clamp(8px,2vw,14px)]",
        "rounded-xl",
        highlight
          ? "bg-green-100/60 ring-2 ring-green-700/20 shadow-sm"
          : "bg-transparent",
        "transition-colors transition-transform",
        "enabled:hover:bg-white/45 enabled:active:translate-y-0.5",
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
          "text-[clamp(28px,8vw,52px)] font-extrabold leading-none",
        ].join(" ")}
      >
        {value ?? ""}
      </span>
    </button>
  );
}
