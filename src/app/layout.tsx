import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en">
      <body className={`${spaceGrotesk.className} min-h-screen flex flex-col antialiased`}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
