import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FTTH Warehouse & Material Control Demo | Aysar Obeidat",
  description:
    "Interactive public demo showing FTTH warehouse workflows, material requests, stock movement, issue, return, transfer, and field reconciliation using sample data.",
  alternates: {
    canonical: "/demo/warehouse"
  },
  openGraph: {
    title: "FTTH Warehouse & Material Control Demo | Aysar Obeidat",
    description:
      "Explore a sample FTTH material control workflow for warehouse operations, field issue, returns, transfers, and reconciliation.",
    url: "/demo/warehouse",
    siteName: "Aysar Obeidat Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/demo/warehouse/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FTTH Warehouse and Material Control demo preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FTTH Warehouse & Material Control Demo | Aysar Obeidat",
    description:
      "Interactive FTTH warehouse and material control demo using fictional sample data.",
    images: ["/demo/warehouse/opengraph-image"]
  }
};

export default function WarehouseDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
