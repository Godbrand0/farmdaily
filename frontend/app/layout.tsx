import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReduxProvider } from "./providers/ReduxProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Farm Management System",
  description: "Multi-Livestock Farm ERP System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
