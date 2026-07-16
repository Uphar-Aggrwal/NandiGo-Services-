import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const contentStatusEnum = pgEnum("content_status", ["draft", "published"]);
export const testimonialWingEnum = pgEnum("testimonial_wing", ["general", "sacred"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "closed"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
};

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps
});

export const states = pgTable(
  "states",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    vibeText: text("vibe_text").notNull(),
    heroVideoUrl: text("hero_video_url"),
    heroVideoKey: text("hero_video_key"),
    heroPosterUrl: text("hero_poster_url"),
    heroPosterKey: text("hero_poster_key"),
    cardImageUrl: text("card_image_url"),
    cardImageKey: text("card_image_key"),
    mapEmbedUrl: text("map_embed_url"),
    displayOrder: integer("display_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    seoMetaTitle: text("seo_meta_title"),
    seoMetaDescription: text("seo_meta_description"),
    seoMetaLink: text("seo_meta_link"),
    seoKeywords: text("seo_keywords"),
    ...timestamps
  },
  (table) => ({
    slugIdx: uniqueIndex("states_slug_idx").on(table.slug),
    activeIdx: index("states_active_idx").on(table.isActive, table.displayOrder)
  })
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    vibeText: text("vibe_text").notNull(),
    heroVideoUrl: text("hero_video_url"),
    heroVideoKey: text("hero_video_key"),
    heroPosterUrl: text("hero_poster_url"),
    heroPosterKey: text("hero_poster_key"),
    cardImageUrl: text("card_image_url"),
    cardImageKey: text("card_image_key"),
    displayOrder: integer("display_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    seoMetaTitle: text("seo_meta_title"),
    seoMetaDescription: text("seo_meta_description"),
    seoMetaLink: text("seo_meta_link"),
    seoKeywords: text("seo_keywords"),
    ...timestamps
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
    activeIdx: index("categories_active_idx").on(table.isActive, table.displayOrder)
  })
);

export const packages = pgTable(
  "packages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    price: text("price").notNull(),
    durationDays: integer("duration_days").notNull(),
    stateId: uuid("state_id")
      .notNull()
      .references(() => states.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    status: contentStatusEnum("status").default("draft").notNull(),
    startingLocation: text("starting_location").notNull(),
    endingLocation: text("ending_location").notNull(),
    highlights: jsonb("highlights").$type<string[]>().default([]).notNull(),
    itinerary: jsonb("itinerary")
      .$type<Array<{ day: string; title: string; description: string }>>()
      .default([])
      .notNull(),
    activityTable: jsonb("activity_table")
      .$type<Array<{ time: string; activity: string; notes: string }>>()
      .default([])
      .notNull(),
    inclusions: text("inclusions").notNull(),
    exclusions: text("exclusions").notNull(),
    paymentTerms: text("payment_terms").notNull(),
    cancellationPolicy: text("cancellation_policy").notNull(),
    faqs: jsonb("faqs").$type<Array<{ question: string; answer: string }>>().default([]).notNull(),
    travellerResponsibility: text("traveller_responsibility").notNull(),
    mapEmbedUrl: text("map_embed_url"),
    featured: boolean("featured").default(false).notNull(),
    seoMetaTitle: text("seo_meta_title"),
    seoMetaDescription: text("seo_meta_description"),
    seoMetaLink: text("seo_meta_link"),
    seoKeywords: text("seo_keywords"),
    ...timestamps
  },
  (table) => ({
    slugIdx: uniqueIndex("packages_slug_idx").on(table.slug),
    publicIdx: index("packages_public_idx").on(table.status, table.featured),
    stateIdx: index("packages_state_idx").on(table.stateId, table.status),
    categoryIdx: index("packages_category_idx").on(table.categoryId, table.status)
  })
);

export const packageImages = pgTable(
  "package_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    packageId: uuid("package_id")
      .notNull()
      .references(() => packages.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    r2Key: text("r2_key").notNull(),
    altText: text("alt_text").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    mimeType: text("mime_type").default("image/webp").notNull(),
    ...timestamps
  },
  (table) => ({
    packageIdx: index("package_images_package_idx").on(table.packageId, table.sortOrder)
  })
);

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  wing: testimonialWingEnum("wing").default("general").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  roleOrLocation: text("role_or_location").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").default(5).notNull(),
  imageUrl: text("image_url"),
  imageKey: text("image_key"),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  ...timestamps
});

export const hallOfFame = pgTable("hall_of_fame", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  issuingBody: text("issuing_body").notNull(),
  awardYear: integer("award_year").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  imageKey: text("image_key"),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  ...timestamps
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull(),
    author: text("author").notNull(),
    coverImageUrl: text("cover_image_url"),
    coverImageKey: text("cover_image_key"),
    status: contentStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoMetaTitle: text("seo_meta_title"),
    seoMetaDescription: text("seo_meta_description"),
    seoMetaLink: text("seo_meta_link"),
    seoKeywords: text("seo_keywords"),
    ...timestamps
  },
  (table) => ({
    slugIdx: uniqueIndex("blog_posts_slug_idx").on(table.slug),
    publicIdx: index("blog_posts_public_idx").on(table.status, table.publishedAt)
  })
);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  contactInfo: text("contact_info").notNull(),
  email: text("email").notNull(),
  serviceType: text("service_type").notNull(),
  query: text("query").notNull(),
  status: leadStatusEnum("status").default("new").notNull(),
  ...timestamps
});

export const homepageContent = pgTable("homepage_content", {
  id: text("id").primaryKey().default("homepage"),
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  heroVideoUrl: text("hero_video_url"),
  heroVideoKey: text("hero_video_key"),
  heroPosterUrl: text("hero_poster_url"),
  heroPosterKey: text("hero_poster_key"),
  mottoTitle: text("motto_title").notNull(),
  mottoBody: text("motto_body").notNull(),
  aboutTitle: text("about_title").notNull(),
  aboutBody: text("about_body").notNull(),
  aboutImageOneUrl: text("about_image_one_url"),
  aboutImageOneKey: text("about_image_one_key"),
  aboutImageTwoUrl: text("about_image_two_url"),
  aboutImageTwoKey: text("about_image_two_key"),
  aboutImageThreeUrl: text("about_image_three_url"),
  aboutImageThreeKey: text("about_image_three_key"),
  servicesTitle: text("services_title").notNull(),
  featuredPackagesTitle: text("featured_packages_title").notNull(),
  testimonialsTitle: text("testimonials_title").notNull(),
  hallOfFameTitle: text("hall_of_fame_title").notNull(),
  seoMetaTitle: text("seo_meta_title"),
  seoMetaDescription: text("seo_meta_description"),
  seoMetaLink: text("seo_meta_link"),
  seoKeywords: text("seo_keywords"),
  ...timestamps
});

export const professionalServicesContent = pgTable("professional_services_content", {
  id: text("id").primaryKey().default("professional-services"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageOneUrl: text("image_one_url"),
  imageOneKey: text("image_one_key"),
  imageTwoUrl: text("image_two_url"),
  imageTwoKey: text("image_two_key"),
  ctaLabel: text("cta_label").notNull(),
  ctaHref: text("cta_href").notNull(),
  seoMetaTitle: text("seo_meta_title"),
  seoMetaDescription: text("seo_meta_description"),
  seoMetaLink: text("seo_meta_link"),
  seoKeywords: text("seo_keywords"),
  ...timestamps
});

export const sacredWingContent = pgTable("sacred_wing_content", {
  id: text("id").primaryKey().default("sacred"),
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  heroVideoUrl: text("hero_video_url"),
  heroVideoKey: text("hero_video_key"),
  heroPosterUrl: text("hero_poster_url"),
  heroPosterKey: text("hero_poster_key"),
  servicesTitle: text("services_title").notNull(),
  servicesDescription: text("services_description").notNull(),
  expertiseTitle: text("expertise_title").notNull(),
  expertiseDescription: text("expertise_description").notNull(),
  contactTitle: text("contact_title").notNull(),
  contactBody: text("contact_body").notNull(),
  ctaLabel: text("cta_label").notNull(),
  ctaHref: text("cta_href").notNull(),
  seoMetaTitle: text("seo_meta_title"),
  seoMetaDescription: text("seo_meta_description"),
  seoMetaLink: text("seo_meta_link"),
  seoKeywords: text("seo_keywords"),
  ...timestamps
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("site"),
  aboutTitle: text("about_title").notNull(),
  aboutBody: text("about_body").notNull(),
  officeAddress: text("office_address").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactEmail: text("contact_email").notNull(),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  linkedinUrl: text("linkedin_url"),
  youtubeUrl: text("youtube_url"),
  footerNote: text("footer_note").notNull(),
  seoMetaTitle: text("seo_meta_title"),
  seoMetaDescription: text("seo_meta_description"),
  seoMetaLink: text("seo_meta_link"),
  seoKeywords: text("seo_keywords"),
  ...timestamps
});

export const packagesRelations = relations(packages, ({ one, many }) => ({
  state: one(states, {
    fields: [packages.stateId],
    references: [states.id]
  }),
  category: one(categories, {
    fields: [packages.categoryId],
    references: [categories.id]
  }),
  images: many(packageImages)
}));

export const packageImagesRelations = relations(packageImages, ({ one }) => ({
  package: one(packages, {
    fields: [packageImages.packageId],
    references: [packages.id]
  })
}));

export const statesRelations = relations(states, ({ many }) => ({
  packages: many(packages)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  packages: many(packages)
}));
