"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useAppStore } from "@/store/appStore";

export function WaitingPanel() {
  const ticketId = useAppStore((s) => s.ticketId);
  const nickname = useAppStore((s) => s.nickname);

  const { leave, isLeaving, connectionStatus } = useMatchmaking();

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-lg font-semibold">
            Aguardando outro jogador...
          </div>
          <div className="mt-1 text-sm opacity-80">
            Nickname: <span className="font-medium">{nickname}</span>
          </div>
          <div className="mt-1 text-sm opacity-70">
            Conexão: {connectionStatus}
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={async () => {
            if (!ticketId) return;
            await leave(ticketId);
          }}
          disabled={!ticketId || isLeaving}
        >
          {isLeaving ? "Cancelando..." : "Cancelar"}
        </Button>
      </div>
    </Card>
  );
}
