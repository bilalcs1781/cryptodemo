import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/store/Provider";
import ToastProvider from "@/components/layout/ToastProvider";
import StripeProvider from "@/components/layout/StripeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoHub",
  description: "Your gateway to the world of cryptocurrency",
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
        <Provider>
          <StripeProvider>
            {children}
            <ToastProvider />
          </StripeProvider>
        </Provider>
      </body>
    </html>
  );
}
