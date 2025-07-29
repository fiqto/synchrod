import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synchrod - Merge, Customize, Convert JSON Effortlessly",
  description: "Online toolset for working with JSON data. Merge, customize, and transform JSON files with ease.",
  keywords: ["JSON", "merge", "convert", "transform", "tool", "developer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
