import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQLab FINKI",
  description: "Интерактивна платформа за вежбање SQL за студентите на ФИНКИ",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mk">
      <body>{children}</body>
    </html>
  );
}
