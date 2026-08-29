import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FTTH Site Survey & Infrastructure Mapping Demo | Aysar Obeidat",
  description:
    "Interactive public demo for FTTH site survey workflows, including building capture, pole and infrastructure records, GPS sample data, validation, and schematic map review.",
  alternates: {
    canonical: "/demo/site-survey"
  },
  openGraph: {
    title: "FTTH Site Survey & Infrastructure Mapping Demo | Aysar Obeidat",
    description:
      "Explore a sample FTTH field survey and infrastructure mapping workflow for buildings, poles, premises, GPS records, and validation.",
    url: "/demo/site-survey",
    siteName: "Aysar Obeidat Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/demo/site-survey/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FTTH Site Survey and Infrastructure Mapping demo preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FTTH Site Survey & Infrastructure Mapping Demo | Aysar Obeidat",
    description:
      "Interactive FTTH site survey and infrastructure mapping demo using fictional sample data.",
    images: ["/demo/site-survey/opengraph-image"]
  }
};

export default function SiteSurveyDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
