import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "dayjs/plugin/relativeTime";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Web3ModalProvider from "./web3";

dayjs.extend(duration);

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Claim Your FLT DROP",
  description: "",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Web3ModalProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
          <Analytics />
        </body>
      </html>
    </Web3ModalProvider>
  );
}
