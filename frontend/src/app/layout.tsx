import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSerifSC = Noto_Serif_SC({ variable: "--font-noto-serif", weight: ["300", "400", "700"], subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "600", "700"] });

export const metadata: Metadata = {
  title: "同路 | 长期关系评估",
  description: "面向长期关系的结构化测评与分析",
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
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
