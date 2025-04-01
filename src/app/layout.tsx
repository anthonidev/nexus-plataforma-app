import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Global Network",
  description: "Plataforma de gestión y visualización de redes multinivel",
  keywords: ["Nexus", "redes", "multinivel", "network marketing", "MLM"],
  authors: [{ name: "Nexus Global Network" }],
  creator: "Nexus Global Network",
  icons: {
    icon: "/imgs/logo.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* <Toaster /> */}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
