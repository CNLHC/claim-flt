import Clarity from "@/lib/clarity";
import { GoogleAnalytics } from "@next/third-parties/google";

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
Clarity.init(process.env.NEXT_PUBLIC_CLARITY_ID);

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Claim Locked FLT",
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
        <head>
          <script type="text/javascript"></script>
          <script type="text/javascript"></script>
        </head>

        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
          <Analytics />
        </body>
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_ID ?? "G-5559MJVSD8"}
        />
      </html>
    </Web3ModalProvider>
  );
}
