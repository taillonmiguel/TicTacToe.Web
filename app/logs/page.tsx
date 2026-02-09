import Link from "next/link";

import { Card } from "@/components/ui/Card";

export default function LogsPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-4 py-8">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Logs/Ações</div>
              <div className="mt-1 text-sm opacity-80">
                Ações são por partida (GameId). Use "Ver Ações" dentro de um
                jogo.
              </div>
            </div>
            <Link className="underline opacity-90 hover:opacity-100" href="/">
              Voltar
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm opacity-80">
            Para ver logs, entre em um jogo e clique em "Ver Ações".
          </div>
        </Card>
      </main>
    </div>
  );
}
