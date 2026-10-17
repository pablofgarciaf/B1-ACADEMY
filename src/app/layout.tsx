import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import CookieConsent from "@/components/legal/CookieConsent";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import HelpWidget from "@/components/site/HelpWidget";
import "./globals.css";
import { SITE_URL, publicUrl } from "@/lib/site-url";
import CampaignAttribution from '@/components/site/CampaignAttribution';

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    "Simulador contable educativo Ecuador",
    "Cursos de gestión empresarial Ecuador",
  ],
  authors: [{ name: "Finix Academy" }],
  creator: "Finix Academy",
  publisher: "Finix Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: publicUrl(),
  },
  openGraph: {
    title: "Finix Academy | Formación y Consultoría Finix ERP",
    description:
      "Formación especializada y consultoría en Finix ERP para empresas y profesionales, con prácticas, evaluación y oportunidades laborales en español.",
    url: publicUrl(),
    siteName: "Finix Academy",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: publicUrl('/icon.png'),
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
    images: [publicUrl('/icon.png')],
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

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Finix Academy",
  url: publicUrl(),
  logo: publicUrl('/icon.png'),
  description:
    "Plataforma educativa en español con cursos y prácticas de gestión empresarial y uso del simulador Finix ERP.",
  areaServed: "EC",
  inLanguage: "es",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-300">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
            <CampaignAttribution />
            <HelpWidget />
          </AuthProvider>
          {/* LOPDP: Google Tag Manager solo se carga tras el consentimiento de analítica (antes se cargaba siempre). */}
          <CookieConsent gtmId={GTM_ID} />
        </ThemeProvider>
      </body>
    </html>
  );
}
