import "dotenv/config";

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  categories,
  homepageContent,
  professionalServicesContent,
  sacredWingContent,
  siteSettings,
  states
} from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

const db = getDb();

const stateNames = [
  "Uttar Pradesh",
  "Uttarakhand",
  "Bengal",
  "Odisha",
  "Gujarat",
  "Rajasthan",
  "Punjab",
  "Himachal Pradesh",
  "Ladakh",
  "Madhya Pradesh"
];

const categoryNames = [
  "Pilgrimage",
  "Honeymoons & Romantic Getaways",
  "Trekking & Adventure",
  "Family Tours",
  "Solo Discovery",
  "Strangers Meet (Group Travel)",
  "Jungle Safari",
  "Whispering Peaks (Hillstations)"
];

async function upsertState(name: string, index: number) {
  const slug = slugify(name);
  const existing = await db.query.states.findFirst({ where: eq(states.slug, slug) });
  const values = {
    name,
    slug,
    summary: `${name} journeys curated with local knowledge, comfortable movement, and flexible travel pacing.`,
    description: `${name} is presented as a standalone destination page in NandiGo's catalog. Admin teams can replace this narrative, video, poster, images, map, SEO metadata, and page tone without editing code.`,
    vibeText: `A destination page shaped around the mood, geography, food, devotion, landscapes, and lived pace of ${name}.`,
    displayOrder: index,
    isActive: true,
    seoMetaTitle: `${name} Tour Packages | NandiGo`,
    seoMetaDescription: `Explore curated ${name} tours by NandiGo across pilgrimage, leisure, family, adventure, romantic, and premium travel styles.`,
    seoKeywords: `${name}, NandiGo, India travel, destination management`
  };

  if (existing) {
    await db.update(states).set({ ...values, updatedAt: new Date() }).where(eq(states.id, existing.id));
    return;
  }
  await db.insert(states).values(values);
}

async function upsertCategory(name: string, index: number) {
  const slug = slugify(name);
  const existing = await db.query.categories.findFirst({ where: eq(categories.slug, slug) });
  const values = {
    name,
    slug,
    summary: `${name} experiences designed with clear inclusions, thoughtful routing, and a memorable travel arc.`,
    description: `${name} is an independent experience page. Packages assigned here can also belong to any state, and both pages point to the same canonical package detail page.`,
    vibeText: `A browsing path for travellers who choose the feeling of the journey first, then the destination.`,
    displayOrder: index,
    isActive: true,
    seoMetaTitle: `${name} Packages | NandiGo`,
    seoMetaDescription: `Browse NandiGo ${name} packages across India's state-wise catalog with fully editable package details and itineraries.`,
    seoKeywords: `${name}, NandiGo, India experiences, curated travel`
  };

  if (existing) {
    await db.update(categories).set({ ...values, updatedAt: new Date() }).where(eq(categories.id, existing.id));
    return;
  }
  await db.insert(categories).values(values);
}

async function main() {
  for (const [index, name] of stateNames.entries()) {
    await upsertState(name, index + 1);
  }

  for (const [index, name] of categoryNames.entries()) {
    await upsertCategory(name, index + 1);
  }

  await db
    .insert(homepageContent)
    .values({
      id: "homepage",
      heroTitle: "NandiGo",
      heroSubtitle: "Curated journeys across the Indian subcontinent for travellers who want the trip to stay with them.",
      mottoTitle: "Travel arranged with feeling, precision, and memory.",
      mottoBody:
        "NandiGo combines accommodation, meals, transport, local knowledge, and careful service design so every journey feels intentional rather than mechanical.",
      aboutTitle: "A destination management company for modern India travel.",
      aboutBody:
        "From family holidays and romantic retreats to pilgrimages, forests, peaks, groups, and bespoke premium travel, NandiGo builds routes that respect pace, comfort, culture, and the reason behind the journey.",
      servicesTitle: "Browse by destination, experience, or professional service.",
      featuredPackagesTitle: "Upcoming and featured journeys.",
      testimonialsTitle: "Traveller notes.",
      hallOfFameTitle: "Recognition and hall of fame.",
      seoMetaTitle: "NandiGo | Destination Management Company in India",
      seoMetaDescription:
        "NandiGo creates curated India travel experiences across states, categories, professional services, and sacred VIP spiritual travel."
    })
    .onConflictDoUpdate({
      target: homepageContent.id,
      set: {
        heroTitle: "NandiGo",
        heroSubtitle: "Curated journeys across the Indian subcontinent for travellers who want the trip to stay with them.",
        updatedAt: new Date()
      }
    });

  await db
    .insert(professionalServicesContent)
    .values({
      id: "professional-services",
      title: "Events, Conferences & Corporate Getaways",
      description:
        "A single professional services block for MICE, conferences, offsites, events, and corporate travel coordination. The admin team can replace this text, the supporting images, and CTA anytime.",
      ctaLabel: "Plan a professional movement",
      ctaHref: "/lets-connect",
      seoMetaTitle: "Professional Travel Services | NandiGo",
      seoMetaDescription: "Events, conferences, corporate getaways, and professional travel coordination by NandiGo."
    })
    .onConflictDoUpdate({
      target: professionalServicesContent.id,
      set: {
        title: "Events, Conferences & Corporate Getaways",
        updatedAt: new Date()
      }
    });

  await db
    .insert(sacredWingContent)
    .values({
      id: "sacred",
      heroTitle: "Sacred Travel by NandiGo",
      heroSubtitle:
        "A discreet spiritual travel wing for gurus, kathavachaks, shankaracharyas, and high-value spiritual leaders.",
      servicesTitle: "Purified movement, respectful logistics, and privacy-first hospitality.",
      servicesDescription:
        "The sacred wing focuses on seamless route planning, clean accommodation, cultural sensitivity, privacy, darshan coordination, movement comfort, and a service tone appropriate to spiritual leadership.",
      expertiseTitle: "Built for spiritual responsibility.",
      expertiseDescription:
        "Every arrangement is planned around sanctity, timing, entourage coordination, dietary expectations, local protocol, and quiet execution.",
      contactTitle: "Begin a confidential conversation.",
      contactBody:
        "Share the broad travel requirement and our team will respond with an appropriately private planning process.",
      ctaLabel: "Connect with NandiGo",
      ctaHref: "/lets-connect",
      seoMetaTitle: "Sacred VIP Spiritual Travel | NandiGo",
      seoMetaDescription:
        "NandiGo Sacred Wing provides discreet travel coordination for spiritual VIPs, gurus, kathavachaks, and high-value spiritual leaders."
    })
    .onConflictDoUpdate({
      target: sacredWingContent.id,
      set: {
        heroTitle: "Sacred Travel by NandiGo",
        updatedAt: new Date()
      }
    });

  await db
    .insert(siteSettings)
    .values({
      id: "site",
      aboutTitle: "About NandiGo",
      aboutBody:
        "NandiGo is a destination management company focused on the Indian subcontinent, with general public travel and a separate sacred spiritual VIP wing.",
      officeAddress: "India",
      contactPhone: "+91 00000 00000",
      contactEmail: "connect@nandigo.in",
      footerNote: "NandiGo plans experiences with care, cultural respect, and practical travel intelligence.",
      seoMetaTitle: "About NandiGo",
      seoMetaDescription: "Learn about NandiGo's travel planning, destination management, and sacred VIP spiritual services."
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        aboutTitle: "About NandiGo",
        updatedAt: new Date()
      }
    });
}

main()
  .then(() => {
    console.log("NandiGo seed complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
