"use client";

import type { CellValue } from "@/lib/gameModel";
import { Cell } from "@/components/game/Cell";

export function Board(props: {
  board: CellValue[];
  canPlay: boolean;
  onPlay: (pos: number) => void;
  className?: string;
  cellClassName?: string;
  highlightIndices?: number[] | null;
}) {
  const highlights = new Set(props.highlightIndices ?? []);
  const thickness = "clamp(10px, 2.6vw, 18px)";

  return (
    <div
      className={["relative h-full w-full", props.className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ ["--t" as any]: thickness } as any}
      >
        <div
          className="absolute inset-y-0 rounded-full bg-foreground/25 shadow-sm"
          style={{ left: "calc(33.333% - (var(--t) / 2))", width: "var(--t)" }}
        />
        <div
          className="absolute inset-y-0 rounded-full bg-foreground/25 shadow-sm"
          style={{ left: "calc(66.666% - (var(--t) / 2))", width: "var(--t)" }}
        />
        <div
          className="absolute inset-x-0 rounded-full bg-foreground/25 shadow-sm"
          style={{ top: "calc(33.333% - (var(--t) / 2))", height: "var(--t)" }}
        />
        <div
          className="absolute inset-x-0 rounded-full bg-foreground/25 shadow-sm"
          style={{ top: "calc(66.666% - (var(--t) / 2))", height: "var(--t)" }}
        />
      </div>

      <div className="relative z-10 grid h-full w-full grid-cols-3 gap-0">
        {props.board.map((value, idx) => (
          <Cell
            key={idx}
            value={value}
            className={props.cellClassName}
            onClick={() => props.onPlay(idx)}
            disabled={!props.canPlay || Boolean(value)}
            highlight={highlights.has(idx)}
            aria-label={`casa-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}
