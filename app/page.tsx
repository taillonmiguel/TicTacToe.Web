import { Card } from "@/components/ui/Card";
import { NicknameForm } from "@/components/matchmaking/NicknameForm";
import { AtalhosAbaCaderno } from "@/components/navigation/AtalhosAbaCaderno";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-8 sm:py-10">
        <Card className="w-full">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Jogo da Velha Online
              </h1>
            </div>

            <NicknameForm />

            <div className="pt-1">
              <AtalhosAbaCaderno />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
