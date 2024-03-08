"use client"
import {Inter} from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import {RecoilRoot} from "recoil";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <RecoilRoot>
        <Toaster richColors closeButton/>
        <body className={`${inter.className}`}>{children}</body>
      </RecoilRoot>
    </html>
  );
}
