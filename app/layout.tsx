import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Reem_Kufi_Fun } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const reemKufiFun = Reem_Kufi_Fun({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-reem-kufi-fun",
});

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} ${reemKufiFun.variable}`}>{children}</body>
    </html>
  );
}
