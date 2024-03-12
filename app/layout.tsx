import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

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
      <html lang="en">
          <Head>
              <link rel="manifest" href="/manifest.json" />
          </Head>
          <body className={inter.className}>{children}</body>
      </html>
  );
}
