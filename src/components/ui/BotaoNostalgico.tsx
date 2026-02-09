"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import styles from "./BotaoNostalgico.module.css";

type Variant = "azul" | "verde" | "amarelo" | "rosa";

type Common = {
  variant?: Variant;
  className?: string;
};

type ButtonProps = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkProps = Common &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

function cls(
  variant: Variant,
  className: string | undefined,
  disabled?: boolean,
) {
  return [
    styles.base,
    styles[variant],
    disabled ? styles.disabled : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function BotaoNostalgico(props: ButtonProps | LinkProps) {
  const variant = props.variant ?? "azul";

  if ("href" in props) {
    const { href, className, ...rest } = props;
    return (
      <Link
        href={href}
        className={cls(variant, className, (rest as any).disabled)}
        {...rest}
      />
    );
  }

  const { className, disabled, ...rest } = props;
  return (
    <button
      className={cls(variant, className, disabled)}
      disabled={disabled}
      {...rest}
    />
  );
}
