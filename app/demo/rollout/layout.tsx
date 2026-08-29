import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FTTH Rollout Management Demo | Aysar Obeidat",
  description:
    "Interactive public demo for FTTH rollout management, covering dashboard monitoring, field entry, operations, network validation, material reconciliation, and area reporting with sample data.",
  alternates: {
    canonical: "/demo/rollout"
  },
  openGraph: {
    title: "FTTH Rollout Management Demo | Aysar Obeidat",
    description:
      "Explore a sample FTTH rollout operations system for field progress, network validation, warehouse reconciliation, and management reporting.",
    url: "/demo/rollout",
    siteName: "Aysar Obeidat Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/demo/rollout/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FTTH Rollout Management demo preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FTTH Rollout Management Demo | Aysar Obeidat",
    description:
      "Interactive FTTH rollout management demo using fictional sample data.",
    images: ["/demo/rollout/opengraph-image"]
  }
};

export default function RolloutDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
