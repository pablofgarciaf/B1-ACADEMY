import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import CookieConsent from "@/components/legal/CookieConsent";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import HelpWidget from "@/components/site/HelpWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Title estricto: 50-60 caracteres (Actual: 55 caracteres)
// Meta description estricta: 120-160 caracteres (Actual: 149 caracteres)
export const metadata: Metadata = {
  metadataBase: new URL("https://b1-academy.vercel.app"),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  title: {
    default: "Finix Academy | Formación y Consultoría Finix ERP",
    template: "%s | Finix Academy",
  },
  description:
    "Formación especializada y consultoría en Finix ERP para empresas y profesionales, con prácticas, evaluación y oportunidades laborales en español.",
  keywords: [
    "Capacitación Finix ERP",
    "Consultoría Finix ERP B2B",
    "Certificación Finix ERP S/4HANA",
    "Bolsa de empleo Finix ERP",
    "Finix ERP FICO MM SD",
  ],
  authors: [{ name: "Finix Academy Engineering Team", url: "https://b1-academy.vercel.app" }],
  creator: "Finix Academy",
  publisher: "Finix Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://b1-academy.vercel.app",
  },
  openGraph: {
    title: "Finix Academy | Formación y Consultoría Finix ERP",
    description:
      "Formación especializada y consultoría en Finix ERP para empresas y profesionales, con prácticas, evaluación y oportunidades laborales en español.",
    url: "https://b1-academy.vercel.app",
    siteName: "Finix Academy",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://b1-academy.vercel.app/b1-academy-logo.webp",
        width: 500,
        height: 500,
        alt: "Finix Academy - Plataforma de Capacitación y Consultoría Empresarial Finix ERP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finix Academy | Formación y Consultoría Finix ERP",
    description:
      "Formación especializada y consultoría en Finix ERP para profesionales y empresas.",
    images: ["https://b1-academy.vercel.app/b1-academy-logo.webp"],
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
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-FINIXACADEMY";

// Schema.org EducationalOrganization para enriquecimiento en Google y LLMs (GEO)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Finix Academy",
  url: "https://b1-academy.vercel.app",
  logo: "https://b1-academy.vercel.app/logo.png",
  description:
    "Institución especializada en capacitación operativa, consultoría empresarial y certificación avanzada en soluciones de ecosistema Finix ERP.",
  sameAs: [
    "https://www.linkedin.com/company/finix-academy-global",
    "https://twitter.com/finixacademy",
  ],
  areaServed: ["ES", "MX", "CO", "PE", "CL", "AR"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Programas de Certificación Finix ERP",
    itemListElement: [
      {
        "@type": "Course",
        name: "Programa Integral Finix ERP S/4HANA & Consultoría Empresarial",
        description:
          "Formación intensiva de operatividad, configuración de procesos y arquitectura empresarial.",
        provider: {
          "@type": "Organization",
          name: "Finix Academy",
          sameAs: "https://b1-academy.vercel.app",
        },
      },
    ],
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Admissions & Corporate Consulting",
    availableLanguage: ["Spanish", "English"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-300">

        {/* Inyección de Grafo Estructurado Schema.org en Byte-0 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
            <HelpWidget />
          </AuthProvider>
          {/* LOPDP: Google Tag Manager solo se carga tras el consentimiento de analítica (antes se cargaba siempre). */}
          <CookieConsent gtmId={GTM_ID} />
        </ThemeProvider>
      </body>
    </html>
  );
}
