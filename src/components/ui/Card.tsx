import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: Props) {
  return <div className={`containerCard p-6 ${className}`} {...props} />;
}
