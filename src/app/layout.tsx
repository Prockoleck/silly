import type { Metadata } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Silly — interactive mini-games",
    template: "%s — Silly",
  },
  description: "A collection of silly interactive mini-games and experiments. Free to play, no signup required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-body">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
