"use client";

import type { EstrategiaVitoriosaItem } from "@/services/analytics";

export function ListaEstrategias(props: { itens: EstrategiaVitoriosaItem[] }) {
  const topKey = props.itens[0]?.estrategia ?? "";

  return (
    <div className="flex flex-col gap-3">
      {props.itens.map((it) => {
        const isTop = it.estrategia === topKey;
        const apagado = it.percentual < 10;

        return (
          <div
            key={it.estrategia}
            className={[
              "rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm",
              apagado ? "opacity-60" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{it.estrategia}</div>
                <div className="mt-1 text-xs opacity-70">
                  {it.vitorias} vitórias · {it.percentual.toFixed(1)}%
                </div>
              </div>

              {isTop ? (
                <span className="inline-flex items-center rounded-full border border-yellow-300 bg-yellow-100 px-2 py-0.5 text-xs font-semibold">
                  Mais eficiente
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
