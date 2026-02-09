"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Aba = {
  href: string;
  label: string;
  icon: string;
};

const abas: Aba[] = [
  { href: "/ranking", label: "Ranking", icon: "🏆" },
  { href: "/history", label: "Histórico", icon: "🕒" },
  { href: "/charts", label: "Gráficos", icon: "📊" },
  { href: "/strategies", label: "Estratégias", icon: "💡" },
  { href: "/logs", label: "Logs/Ações", icon: "🧾" },
];

const colorClasses = [
  "bg-yellow-100 border-yellow-300",
  "bg-blue-100 border-blue-300",
  "bg-green-100 border-green-300",
  "bg-pink-100 border-pink-300",
  "bg-purple-100 border-purple-300",
] as const;

export function AtalhosAbaCaderno() {
  const pathname = usePathname();

  return (
    <nav aria-label="Atalhos" className="flex flex-wrap justify-center gap-2">
      {abas.map((a, idx) => {
        const active = pathname === a.href;
        const color = colorClasses[idx % colorClasses.length];

        return (
          <Link
            key={a.href}
            href={a.href}
            className={[
              "inline-flex items-center gap-2",
              "px-3 py-2",
              "rounded-full border",
              "shadow-sm",
              "text-sm font-semibold",
              "transition-transform",
              "hover:-translate-y-0.5",
              "active:translate-y-0",
              "focus:outline-none focus:ring-2 focus:ring-foreground/20",
              color,
              active
                ? "underline decoration-foreground/60 decoration-4 underline-offset-4"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={active ? "page" : undefined}
          >
            <span aria-hidden>{a.icon}</span>
            <span>{a.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
