import type { Metadata } from "next";
import "./globals.css";
import { ViewModeProvider } from "@/components/ViewModeContext";

export const metadata: Metadata = {
  title: "WindyWallet — Smarter Bills. Stronger Loop.",
  description: "Chicago Loop–exclusive bill optimizer. Find cheaper mobile, internet, transit, and insurance alternatives — with real Chicago pricing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <ViewModeProvider>{children}</ViewModeProvider>
      </body>
    </html>
  );
}
