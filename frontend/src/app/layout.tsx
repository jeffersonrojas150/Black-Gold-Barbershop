import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: "Black Gold Barbershop",
  description: "Sistema de reservas premium para barbería",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${playfair.variable} bg-dark text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}