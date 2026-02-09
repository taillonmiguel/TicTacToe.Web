"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { WaitingPanel } from "@/components/matchmaking/WaitingPanel";
import { useAppStore } from "@/store/appStore";

export default function WaitingPage() {
  const router = useRouter();
  const ticketId = useAppStore((s) => s.ticketId);
  const nickname = useAppStore((s) => s.nickname);

  useEffect(() => {
    if (!nickname) router.replace("/");
    if (!ticketId) router.replace("/");
  }, [nickname, router, ticketId]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-10">
        <WaitingPanel />
      </main>
    </div>
  );
}
