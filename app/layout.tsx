import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import Head from "next/head";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});


export const metadata: Metadata = {
  title: "Job Tracker",
  description: "A simple app for tracking number of jobs done per day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
          <Head>
              <link rel="manifest" href="/manifest.json" />
          </Head>
          <body
              className={cn(
                  "min-h-screen bg-background font-sans antialiased",
                  fontSans.variable
              )}
          >
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
              >
                  {children}
              </ThemeProvider>
          </body>
      </html>
  );
}
