import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Fee Collection - feepayr.com",
  description: "Student online fee collection portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-100">{children}</body>
    </html>
  );
}
