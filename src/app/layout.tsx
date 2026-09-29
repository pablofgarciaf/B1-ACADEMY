import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://sapacademy.es"),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  title: {
    default: "SAP Academy | Certificación y Consultoría SAP Oficial",
    template: "%s | SAP Academy",
  },
  description:
    "Capacitación oficial y consultoría en SAP para empresas y profesionales. Certifícate y accede a nuestra bolsa de empleo exclusiva en España y Latam.",
  keywords: [
    "Capacitación SAP",
    "Consultoría SAP B2B",
    "Certificación SAP S/4HANA",
    "Bolsa de empleo SAP",
    "SAP FICO MM SD",
  ],
  authors: [{ name: "SAP Academy Engineering Team", url: "https://sapacademy.es" }],
  creator: "SAP Academy",
  publisher: "SAP Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://sapacademy.es",
  },
  openGraph: {
    title: "SAP Academy | Certificación y Consultoría SAP Oficial",
    description:
      "Capacitación oficial y consultoría en SAP para empresas y profesionales. Certifícate y accede a nuestra bolsa de empleo exclusiva en España y Latam.",
    url: "https://sapacademy.es",
    siteName: "SAP Academy",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://sapacademy.es/og-cover.png",
        width: 1200,
        height: 630,
        alt: "SAP Academy - Plataforma de Capacitación y Consultoría Empresarial SAP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAP Academy | Certificación y Consultoría SAP Oficial",
    description:
      "Capacitación oficial y consultoría en SAP para empresas y profesionales. Certifícate y accede a nuestra bolsa de empleo.",
    images: ["https://sapacademy.es/og-cover.png"],
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

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-SAPACADEMY";

// Schema.org EducationalOrganization para enriquecimiento en Google y LLMs (GEO)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "SAP Academy",
  url: "https://sapacademy.es",
  logo: "https://sapacademy.es/logo.png",
  description:
    "Institución especializada en capacitación operativa, consultoría empresarial y certificación avanzada en soluciones de ecosistema SAP.",
  sameAs: [
    "https://www.linkedin.com/company/sap-academy-global",
    "https://twitter.com/sapacademy",
  ],
  areaServed: ["ES", "MX", "CO", "PE", "CL", "AR"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Programas de Certificación SAP",
    itemListElement: [
      {
        "@type": "Course",
        name: "Programa Integral SAP S/4HANA & Consultoría Empresarial",
        description:
          "Formación intensiva de operatividad, configuración de procesos y arquitectura empresarial.",
        provider: {
          "@type": "Organization",
          name: "SAP Academy",
          sameAs: "https://sapacademy.es",
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
        {/* Inyección de GTM mediante Script lazyOnload (Total Blocking Time = 0ms) */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

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
        </ThemeProvider>
      </body>
    </html>
  );
}
