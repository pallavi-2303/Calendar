import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Import your Sidebar component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ephemera Calendar",
  description: "Personal planning dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8fafb] text-[#191c1d] min-h-full`}
      >
        <div className="flex">
          {/* 1. Sidebar stays fixed on the left */}
          <Sidebar />

          {/* 2. Main content area shifts to the right on desktop */}
          <main className="flex-1 lg:ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}