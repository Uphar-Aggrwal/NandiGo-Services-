import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

export type SeoRecord = {
  seoMetaTitle?: string | null;
  seoMetaDescription?: string | null;
  seoMetaLink?: string | null;
  seoKeywords?: string | null;
};

export function buildMetadata(record: SeoRecord, fallback: { title: string; description: string; path?: string }): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = record.seoMetaLink?.trim() || `${siteUrl}${fallback.path ?? ""}`;

  return {
    title: record.seoMetaTitle?.trim() || fallback.title,
    description: record.seoMetaDescription?.trim() || fallback.description,
    keywords: record.seoKeywords?.trim() || undefined,
    alternates: {
      canonical
    },
    openGraph: {
      title: record.seoMetaTitle?.trim() || fallback.title,
      description: record.seoMetaDescription?.trim() || fallback.description,
      url: canonical,
      siteName: "NandiGo",
      type: "website"
    }
  };
}
