"use client";

import type { EstrategiaVitoriosaItem } from "@/services/analytics";

export function GraficoBarrasEstrategias(props: {
  itens: EstrategiaVitoriosaItem[];
}) {
  const max = Math.max(1, ...props.itens.map((x) => x.percentual));

  return (
    <div className="rounded-2xl border border-foreground/10 bg-white/70 p-4 shadow-sm">
      <div className="text-sm font-semibold">Percentual por estratégia</div>
      <div className="mt-4 flex flex-col gap-3">
        {props.itens.map((it, idx) => {
          const pct = Math.max(0, Math.min(100, it.percentual));
          const width = (pct / max) * 100;
          const apagado = pct < 10;

          const color =
            idx % 5 === 0
              ? "bg-yellow-300/70"
              : idx % 5 === 1
                ? "bg-blue-300/70"
                : idx % 5 === 2
                  ? "bg-green-300/70"
                  : idx % 5 === 3
                    ? "bg-pink-300/70"
                    : "bg-purple-300/70";

          return (
            <div key={it.estrategia} className={apagado ? "opacity-60" : ""}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <div className="font-semibold">{it.estrategia}</div>
                <div className="opacity-70">{pct.toFixed(1)}%</div>
              </div>
              <div className="h-3 w-full rounded-full border border-foreground/10 bg-white/60">
                <div
                  className={`h-full rounded-full ${color} border border-foreground/10`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
