import type { MetadataRoute } from "next";
import { getAllPackages, getBlogIndex, getNavigationData } from "@/lib/data";
import { getSiteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  try {
    const [nav, packageRows, posts] = await Promise.all([getNavigationData(), getAllPackages(), getBlogIndex()]);
    return [
      "",
      "/packages",
      "/blog",
      "/testimonials",
      "/about",
      "/lets-connect",
      "/professional-services",
      "/sacred",
      ...nav.states.map((item) => `/destinations/${item.slug}`),
      ...nav.categories.map((item) => `/experiences/${item.slug}`),
      ...packageRows.map((item) => `/packages/${item.slug}`),
      ...posts.map((item) => `/blog/${item.slug}`)
    ].map((path) => ({ url: `${site}${path}`, lastModified: new Date() }));
  } catch {
    return [{ url: site, lastModified: new Date() }];
  }
}
