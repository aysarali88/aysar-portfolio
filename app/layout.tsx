import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
