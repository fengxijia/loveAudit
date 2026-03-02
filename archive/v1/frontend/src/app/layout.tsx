import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "结婚对象评估 - AI 驱动的关系分析",
  description:
    "基于婚姻心理学研究的五维评估框架，结合 AI 分析，帮助你更清晰地看清这段感情。",
  keywords: ["婚姻", "评估", "恋爱", "关系", "AI分析"],
  openGraph: {
    title: "结婚对象评估",
    description: "用科学的方式，帮你看清这段感情",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
