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
  title: "진격의 거인 성격 테스트",
  description: "나와 가장 비슷한 진격의 거인 캐릭터는 누구일까? MBTI 기반 성격 테스트로 알아보세요!",
  openGraph: {
    title: "진격의 거인 성격 테스트",
    description: "나와 가장 비슷한 진격의 거인 캐릭터는 누구일까? MBTI 기반 성격 테스트로 알아보세요!",
    images: ["/images/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
