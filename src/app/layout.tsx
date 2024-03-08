import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Fintrac - Gestiona y Controla tus Finanzas Personales",
  description: "Fintrac es la aplicación definitiva para gestionar y controlar tus finanzas personales de manera inteligente y eficiente. Con Fintrac, puedes realizar un seguimiento detallado de tus ingresos, gastos y presupuestos, todo en un solo lugar. Organiza tus transacciones, establece metas financieras, y recibe consejos personalizados para mejorar tu salud financiera. ¡Descarga Fintrac ahora y toma el control total de tus finanzas!",
  keywords: "Finanzas personales, gestión financiera, seguimiento de gastos, presupuesto personal, control financiero, planificación financiera, ahorro e inversión, aplicación de finanzas, herramienta financiera, gestor de dinero"
};


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="es">
    <Toaster richColors closeButton/>
    <body className={inter.className}>{children}</body>
    </html>
  );
}
