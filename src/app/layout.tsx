import type { Metadata } from "next";
import ThemeScript from "@/components/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalkulator Finansów Rodzinnych",
  description:
    "Prywatny budżet domowy — dostęp z każdego urządzenia, logowanie loginem i hasłem, dane tylko dla Ciebie.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
