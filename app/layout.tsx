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
  openGraph: {
    title: "Aysar Obeidat | FTTH Operations & OSP Rollout",
    description:
      "FTTH Operations & Rollout, OSP Deployment, and Telecom Digital Transformation portfolio.",
    type: "website"
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
