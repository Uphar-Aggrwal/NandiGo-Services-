import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { and, asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  blogPosts,
  categories,
  hallOfFame,
  homepageContent,
  packages,
  professionalServicesContent,
  sacredWingContent,
  siteSettings,
  states,
  testimonials
} from "@/lib/db/schema";

export async function getNavigationData() {
  noStore();
  const db = getDb();
  const [stateRows, categoryRows] = await Promise.all([
    db
      .select({ name: states.name, slug: states.slug })
      .from(states)
      .where(eq(states.isActive, true))
      .orderBy(asc(states.displayOrder), asc(states.name)),
    db
      .select({ name: categories.name, slug: categories.slug })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.displayOrder), asc(categories.name))
  ]);

  return { states: stateRows, categories: categoryRows };
}

export async function getSiteSettings() {
  noStore();
  return getDb().query.siteSettings.findFirst({ where: eq(siteSettings.id, "site") });
}

export async function getHomePageData() {
  noStore();
  const db = getDb();
  const [home, professional, stateRows, categoryRows, featuredPackages, testimonialRows, hallRows, blogRows] =
    await Promise.all([
      db.query.homepageContent.findFirst({ where: eq(homepageContent.id, "homepage") }),
      db.query.professionalServicesContent.findFirst({
        where: eq(professionalServicesContent.id, "professional-services")
      }),
      db.query.states.findMany({
        where: eq(states.isActive, true),
        orderBy: [asc(states.displayOrder), asc(states.name)]
      }),
      db.query.categories.findMany({
        where: eq(categories.isActive, true),
        orderBy: [asc(categories.displayOrder), asc(categories.name)]
      }),
      db.query.packages.findMany({
        where: and(eq(packages.status, "published"), eq(packages.featured, true)),
        with: { state: true, category: true, images: true },
        orderBy: [desc(packages.updatedAt)],
        limit: 6
      }),
      db.query.testimonials.findMany({
        where: and(eq(testimonials.published, true), eq(testimonials.wing, "general"), eq(testimonials.featured, true)),
        orderBy: [desc(testimonials.updatedAt)],
        limit: 6
      }),
      db.query.hallOfFame.findMany({
        where: and(eq(hallOfFame.published, true), eq(hallOfFame.featured, true)),
        orderBy: [desc(hallOfFame.awardYear), desc(hallOfFame.updatedAt)],
        limit: 6
      }),
      db.query.blogPosts.findMany({
        where: eq(blogPosts.status, "published"),
        orderBy: [desc(blogPosts.publishedAt), desc(blogPosts.updatedAt)],
        limit: 3
      })
    ]);

  return {
    home,
    professional,
    states: stateRows,
    categories: categoryRows,
    featuredPackages,
    testimonials: testimonialRows,
    hallOfFame: hallRows,
    blogs: blogRows
  };
}

export async function getStatePage(slug: string) {
  noStore();
  const db = getDb();
  const state = await db.query.states.findFirst({
    where: and(eq(states.slug, slug), eq(states.isActive, true))
  });
  if (!state) return null;
  const packageRows = await db.query.packages.findMany({
    where: and(eq(packages.status, "published"), eq(packages.stateId, state.id)),
    with: { state: true, category: true, images: true },
    orderBy: [desc(packages.featured), desc(packages.updatedAt)]
  });
  return { state, packages: packageRows };
}

export async function getCategoryPage(slug: string) {
  noStore();
  const db = getDb();
  const category = await db.query.categories.findFirst({
    where: and(eq(categories.slug, slug), eq(categories.isActive, true))
  });
  if (!category) return null;
  const packageRows = await db.query.packages.findMany({
    where: and(eq(packages.status, "published"), eq(packages.categoryId, category.id)),
    with: { state: true, category: true, images: true },
    orderBy: [desc(packages.featured), desc(packages.updatedAt)]
  });
  return { category, packages: packageRows };
}

export async function getPackagePage(slug: string) {
  noStore();
  return getDb().query.packages.findFirst({
    where: and(eq(packages.slug, slug), eq(packages.status, "published")),
    with: { state: true, category: true, images: true }
  });
}

export async function getAllPackages() {
  noStore();
  return getDb().query.packages.findMany({
    where: eq(packages.status, "published"),
    with: { state: true, category: true, images: true },
    orderBy: [desc(packages.featured), desc(packages.updatedAt)]
  });
}

export async function getBlogIndex() {
  noStore();
  return getDb().query.blogPosts.findMany({
    where: eq(blogPosts.status, "published"),
    orderBy: [desc(blogPosts.publishedAt), desc(blogPosts.updatedAt)]
  });
}

export async function getBlogPost(slug: string) {
  noStore();
  return getDb().query.blogPosts.findFirst({
    where: and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published"))
  });
}

export async function getTestimonialsPage() {
  noStore();
  const db = getDb();
  const [general, sacred, hallRows] = await Promise.all([
    db.query.testimonials.findMany({
      where: and(eq(testimonials.published, true), eq(testimonials.wing, "general")),
      orderBy: [desc(testimonials.featured), desc(testimonials.updatedAt)]
    }),
    db.query.testimonials.findMany({
      where: and(eq(testimonials.published, true), eq(testimonials.wing, "sacred")),
      orderBy: [desc(testimonials.featured), desc(testimonials.updatedAt)]
    }),
    db.query.hallOfFame.findMany({
      where: eq(hallOfFame.published, true),
      orderBy: [desc(hallOfFame.featured), desc(hallOfFame.awardYear)]
    })
  ]);
  return { general, sacred, hallOfFame: hallRows };
}

export async function getSacredPageData() {
  noStore();
  const db = getDb();
  const [content, testimonialRows] = await Promise.all([
    db.query.sacredWingContent.findFirst({ where: eq(sacredWingContent.id, "sacred") }),
    db.query.testimonials.findMany({
      where: and(eq(testimonials.published, true), eq(testimonials.wing, "sacred")),
      orderBy: [desc(testimonials.featured), desc(testimonials.updatedAt)]
    })
  ]);
  return { content, testimonials: testimonialRows };
}

export async function getProfessionalServicesPage() {
  noStore();
  return getDb().query.professionalServicesContent.findFirst({
    where: eq(professionalServicesContent.id, "professional-services")
  });
}
