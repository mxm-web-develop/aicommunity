import type { Metadata } from "next";
import type { Viewport } from 'next'
// import { Inter } from 'next/font/google';
// import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "lucide-react";
import { Providers } from "@/lib/ThemeProvider";
import { headers } from "next/headers";
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Gientech AI+ Community",
  description: "中电尽心-源启AI+社区",
  //viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",

  // mobileWebAppCapable: "yes",
  //appleMobileWebAppStatusBarStyle: "#050505",
};
export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        {/* <Providers> */}
        {children}
        {/* </Providers> */}
      </body>
    </html>
  );
}
