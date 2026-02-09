import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
import { CadernoLayout } from "@/components/layout/CadernoLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jogo da Velha Online",
  description: "Frontend Next.js (App Router) consumindo .NET 8 + SignalR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`caderno ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <CadernoLayout>{children}</CadernoLayout>
        </Providers>
      </body>
    </html>
  );
}
