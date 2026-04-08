import type { Metadata } from "next"
import { APP_NAME, APP_DESCRIPTION, SITE_URL, SOCIAL_LINKS, CONTACT_EMAIL } from "@/lib/constants"
import { Header } from "@/components/web/header"
import { Footer } from "@/components/web/footer"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/shared/json-ld"
import "@/app/embla.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "presentes",
    "gift",
    "ecommerce",
    "loja online",
    "comprar presentes",
    "presentes personalizados",
    "Regalaya",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["pt_BR"],
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@regalaya",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
}

export default function WebLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WishlistProvider>
      {/* JSON-LD Schemas */}
      <WebSiteJsonLd />
      <OrganizationJsonLd
        phone={CONTACT_EMAIL}
        socialLinks={Object.values(SOCIAL_LINKS)}
      />

      <Header />
      <main className="min-h-[calc(100vh-16px)]">
        {children}
      </main>
      <Footer />
    </WishlistProvider>
  )
}
