import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/hooks/useLanguage"
import { AuthProviderWrapper } from "@/components/providers/auth-provider"
import { CartProviderWrapper } from "@/components/providers/cart-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Regalaya",
  description: "Encontre o presente perfeito para cada ocasião",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Noto+Serif:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-body antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProviderWrapper>
            <CartProviderWrapper>
              {children}
              <Toaster />
            </CartProviderWrapper>
          </AuthProviderWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
