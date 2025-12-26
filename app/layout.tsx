import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// 1. Import the Google Analytics component
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "US Salary Needed Calculator (2025 Data)",
  description: "Calculate the salary needed to rent an apartment in any US zip code based on HUD 2025 data.",
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
        {children}
      </body>
      {/* 2. Add the Component with your ID */}
      <GoogleAnalytics gaId="G-7FWF7Z1QEJ" />
    </html>
  );
}