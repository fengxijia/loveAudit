import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LangHtmlAttr from "@/components/LangHtmlAttr";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSerifSC = Noto_Serif_SC({ variable: "--font-noto-serif", weight: ["300", "400", "700"], subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "600", "700"] });

export const metadata: Metadata = {
  title: "LoveAudit | 终身伴侣适配度评估",
  description: "AI驱动的伴侣风险评估系统",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSerifSC.variable} ${cormorant.variable} antialiased`}>
        <LangHtmlAttr />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
