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

  return (
    <div
      className={
        props.className ?? "grid w-full grid-cols-3 justify-center gap-3"
      }
    >
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
  );
}
