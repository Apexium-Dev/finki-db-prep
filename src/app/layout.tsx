import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FINKI DB Prep",
  description: "Practice platform for the FINKI Databases 1 practical exam",
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
