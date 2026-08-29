import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"]
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"]
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aysarobeidat.site"),
  title: "Aysar Obeidat | FTTH Operations & OSP Rollout",
  description:
    "Professional portfolio for Aysar Obeidat, focused on FTTH operations, OSP deployment, rollout management, and telecom digital transformation.",
  keywords: [
    "Aysar Obeidat",
    "FTTH Operations",
    "OSP Deployment",
    "FTTH Rollout",
    "Telecom Digital Transformation",
    "Fiber Optics"
  ],
  authors: [{ name: "Aysar Obeidat" }],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Aysar Obeidat | FTTH Operations & OSP Rollout",
    description:
      "Portfolio for FTTH operations, OSP deployment, rollout management, and telecom digital transformation.",
    url: "/",
    siteName: "Aysar Obeidat Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Aysar Obeidat FTTH operations and rollout portfolio preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Aysar Obeidat | FTTH Operations & OSP Rollout",
    description:
      "Portfolio for FTTH operations, OSP deployment, rollout management, and telecom digital transformation.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
