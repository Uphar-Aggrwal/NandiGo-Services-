"use server";

import bcrypt from "bcryptjs";
import { and, count, eq } from "drizzle-orm";
import { adminDone, adminFail, asInt, getFile, getFiles } from "@/lib/admin-utils";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  adminUsers,
  blogPosts,
  categories,
  hallOfFame,
  homepageContent,
  leads,
  packageImages,
  packages,
  professionalServicesContent,
  sacredWingContent,
  siteSettings,
  states,
  testimonials
} from "@/lib/db/schema";
import {
  formBoolean,
  formOptionalText,
  formText,
  lineList,
  parseActivityTable,
  parseFaqs,
  parseItinerary
} from "@/lib/form-parsers";
import { isGoogleMapsUrl } from "@/lib/maps";
import { deleteMediaKey, uploadMediaFile, validateMediaFile } from "@/lib/r2";
import { slugify } from "@/lib/slug";
import { assertPublishableBlog, assertPublishablePackage, hasMinimumContent } from "@/lib/validation";

async function uploadReplacement(
  formData: FormData,
  fileField: string,
  existingUrlField: string,
  existingKeyField: string,
  folder: string,
  kind: "image" | "video"
) {
  const existingUrl = formOptionalText(formData, existingUrlField);
  const existingKey = formOptionalText(formData, existingKeyField);
  const file = getFile(formData, fileField);
  if (!file) return { url: existingUrl, key: existingKey };

  const validation = validateMediaFile(file, kind);
  if (validation) throw new Error(validation);
  const uploaded = await uploadMediaFile(file, folder, kind);
  if (existingKey) await deleteMediaKey(existingKey);
  return { url: uploaded?.url ?? existingUrl, key: uploaded?.key ?? existingKey };
}

function validateOptionalMap(value: string | null) {
  if (value && !isGoogleMapsUrl(value)) {
    throw new Error("Map URL must be a valid Google Maps share or embed URL.");
  }
}

export async function saveState(formData: FormData) {
  await requireAdmin();
  const path = "/admin/states";
  try {
    const id = formOptionalText(formData, "id");
    const name = formText(formData, "name");
    const slug = slugify(formText(formData, "slug") || name);
    const mapEmbedUrl = formOptionalText(formData, "mapEmbedUrl");
    validateOptionalMap(mapEmbedUrl);
    if (!hasMinimumContent(name) || !hasMinimumContent(slug)) throw new Error("State name and slug are required.");

    const [video, poster, card] = await Promise.all([
      uploadReplacement(formData, "heroVideo", "heroVideoUrl", "heroVideoKey", `states/${slug}`, "video"),
      uploadReplacement(formData, "heroPoster", "heroPosterUrl", "heroPosterKey", `states/${slug}`, "image"),
      uploadReplacement(formData, "cardImage", "cardImageUrl", "cardImageKey", `states/${slug}`, "image")
    ]);

    const values = {
      name,
      slug,
      summary: formText(formData, "summary"),
      description: formText(formData, "description"),
      vibeText: formText(formData, "vibeText"),
      heroVideoUrl: video.url,
      heroVideoKey: video.key,
      heroPosterUrl: poster.url,
      heroPosterKey: poster.key,
      cardImageUrl: card.url,
      cardImageKey: card.key,
      mapEmbedUrl,
      displayOrder: asInt(formText(formData, "displayOrder")),
      isActive: formBoolean(formData, "isActive"),
      seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
      seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
      seoMetaLink: formOptionalText(formData, "seoMetaLink"),
      seoKeywords: formOptionalText(formData, "seoKeywords"),
      updatedAt: new Date()
    };

    if (id) await getDb().update(states).set(values).where(eq(states.id, id));
    else await getDb().insert(states).values(values);
    adminDone(path, "State saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "State could not be saved.");
  }
}

export async function deleteState(formData: FormData) {
  await requireAdmin();
  const path = "/admin/states";
  try {
    const id = formText(formData, "id");
    const [refs] = await getDb().select({ total: count() }).from(packages).where(eq(packages.stateId, id));
    if (refs.total > 0) {
      throw new Error(`Cannot delete: ${refs.total} active packages reference this. Reassign or remove them first.`);
    }
    const state = await getDb().query.states.findFirst({ where: eq(states.id, id) });
    if (state) {
      await Promise.all([
        deleteMediaKey(state.heroVideoKey),
        deleteMediaKey(state.heroPosterKey),
        deleteMediaKey(state.cardImageKey)
      ]);
      await getDb().delete(states).where(eq(states.id, id));
    }
    adminDone(path, "State deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "State could not be deleted.");
  }
}

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const path = "/admin/categories";
  try {
    const id = formOptionalText(formData, "id");
    const name = formText(formData, "name");
    const slug = slugify(formText(formData, "slug") || name);
    if (!hasMinimumContent(name) || !hasMinimumContent(slug)) throw new Error("Category name and slug are required.");

    const [video, poster, card] = await Promise.all([
      uploadReplacement(formData, "heroVideo", "heroVideoUrl", "heroVideoKey", `categories/${slug}`, "video"),
      uploadReplacement(formData, "heroPoster", "heroPosterUrl", "heroPosterKey", `categories/${slug}`, "image"),
      uploadReplacement(formData, "cardImage", "cardImageUrl", "cardImageKey", `categories/${slug}`, "image")
    ]);

    const values = {
      name,
      slug,
      summary: formText(formData, "summary"),
      description: formText(formData, "description"),
      vibeText: formText(formData, "vibeText"),
      heroVideoUrl: video.url,
      heroVideoKey: video.key,
      heroPosterUrl: poster.url,
      heroPosterKey: poster.key,
      cardImageUrl: card.url,
      cardImageKey: card.key,
      displayOrder: asInt(formText(formData, "displayOrder")),
      isActive: formBoolean(formData, "isActive"),
      seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
      seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
      seoMetaLink: formOptionalText(formData, "seoMetaLink"),
      seoKeywords: formOptionalText(formData, "seoKeywords"),
      updatedAt: new Date()
    };

    if (id) await getDb().update(categories).set(values).where(eq(categories.id, id));
    else await getDb().insert(categories).values(values);
    adminDone(path, "Category saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Category could not be saved.");
  }
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const path = "/admin/categories";
  try {
    const id = formText(formData, "id");
    const [refs] = await getDb().select({ total: count() }).from(packages).where(eq(packages.categoryId, id));
    if (refs.total > 0) {
      throw new Error(`Cannot delete: ${refs.total} active packages reference this. Reassign or remove them first.`);
    }
    const category = await getDb().query.categories.findFirst({ where: eq(categories.id, id) });
    if (category) {
      await Promise.all([
        deleteMediaKey(category.heroVideoKey),
        deleteMediaKey(category.heroPosterKey),
        deleteMediaKey(category.cardImageKey)
      ]);
      await getDb().delete(categories).where(eq(categories.id, id));
    }
    adminDone(path, "Category deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Category could not be deleted.");
  }
}

export async function savePackage(formData: FormData) {
  await requireAdmin();
  const path = "/admin/packages";
  try {
    const id = formOptionalText(formData, "id");
    const name = formText(formData, "name");
    const slug = slugify(formText(formData, "slug") || name);
    const stateId = formText(formData, "stateId");
    const categoryId = formText(formData, "categoryId");
    const status: "draft" | "published" = formText(formData, "status") === "published" ? "published" : "draft";
    const mapEmbedUrl = formOptionalText(formData, "mapEmbedUrl");
    validateOptionalMap(mapEmbedUrl);

    if (!stateId || !categoryId) throw new Error("Select both a parent State and a parent Category before saving.");

    const input = {
      name,
      slug,
      description: formText(formData, "description"),
      price: formText(formData, "price"),
      durationDays: asInt(formText(formData, "durationDays"), 0),
      stateId,
      categoryId,
      status,
      startingLocation: formText(formData, "startingLocation"),
      endingLocation: formText(formData, "endingLocation"),
      highlights: lineList(formText(formData, "highlights")),
      itinerary: parseItinerary(formText(formData, "itinerary")),
      activityTable: parseActivityTable(formText(formData, "activityTable")),
      inclusions: formText(formData, "inclusions"),
      exclusions: formText(formData, "exclusions"),
      paymentTerms: formText(formData, "paymentTerms"),
      cancellationPolicy: formText(formData, "cancellationPolicy"),
      faqs: parseFaqs(formText(formData, "faqs")),
      travellerResponsibility: formText(formData, "travellerResponsibility"),
      mapEmbedUrl,
      featured: formBoolean(formData, "featured"),
      seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
      seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
      seoMetaLink: formOptionalText(formData, "seoMetaLink"),
      seoKeywords: formOptionalText(formData, "seoKeywords"),
      updatedAt: new Date()
    };

    if (status === "published") assertPublishablePackage(input);
    if (!hasMinimumContent(name) || !hasMinimumContent(slug)) throw new Error("Package name and slug are required.");

    let packageId = id;
    if (id) {
      await getDb().update(packages).set(input).where(eq(packages.id, id));
    } else {
      const [created] = await getDb().insert(packages).values(input).returning({ id: packages.id });
      packageId = created.id;
    }

    const newImages = getFiles(formData, "images");
    if (newImages.length > 0) {
      for (const file of newImages) {
        const validation = validateMediaFile(file, "image");
        if (validation) throw new Error(validation);
      }
      const existing = await getDb().query.packageImages.findMany({ where: eq(packageImages.packageId, packageId!) });
      if (existing.length + newImages.length > 4) {
        throw new Error("A package can have a maximum of 4 webp images.");
      }
      let sortOrder = existing.length;
      for (const file of newImages) {
        const uploaded = await uploadMediaFile(file, `packages/${slug}`, "image");
        if (uploaded) {
          await getDb().insert(packageImages).values({
            packageId: packageId!,
            url: uploaded.url,
            r2Key: uploaded.key,
            altText: name,
            sortOrder,
            mimeType: "image/webp"
          });
          sortOrder += 1;
        }
      }
    }

    adminDone(path, "Package saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Package could not be saved.");
  }
}

export async function deletePackage(formData: FormData) {
  await requireAdmin();
  const path = "/admin/packages";
  try {
    const id = formText(formData, "id");
    const images = await getDb().query.packageImages.findMany({ where: eq(packageImages.packageId, id) });
    await Promise.all(images.map((image) => deleteMediaKey(image.r2Key)));
    await getDb().delete(packages).where(eq(packages.id, id));
    adminDone(path, "Package deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Package could not be deleted.");
  }
}

export async function deletePackageImage(formData: FormData) {
  await requireAdmin();
  const path = "/admin/packages";
  try {
    const id = formText(formData, "id");
    const image = await getDb().query.packageImages.findFirst({ where: eq(packageImages.id, id) });
    if (image) {
      await deleteMediaKey(image.r2Key);
      await getDb().delete(packageImages).where(eq(packageImages.id, id));
    }
    adminDone(path, "Package image deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Package image could not be deleted.");
  }
}

export async function saveTestimonial(formData: FormData) {
  await requireAdmin();
  const path = "/admin/testimonials";
  try {
    const id = formOptionalText(formData, "id");
    const wing: "general" | "sacred" = formText(formData, "wing") === "sacred" ? "sacred" : "general";
    const image = await uploadReplacement(formData, "image", "imageUrl", "imageKey", `testimonials/${wing}`, "image");
    const values = {
      wing,
      reviewerName: formText(formData, "reviewerName"),
      roleOrLocation: formText(formData, "roleOrLocation"),
      quote: formText(formData, "quote"),
      rating: Math.max(1, Math.min(asInt(formText(formData, "rating"), 5), 5)),
      imageUrl: image.url,
      imageKey: image.key,
      featured: formBoolean(formData, "featured"),
      published: formBoolean(formData, "published"),
      updatedAt: new Date()
    };
    if (!hasMinimumContent(values.reviewerName) || !hasMinimumContent(values.quote)) {
      throw new Error("Reviewer name and quote are required.");
    }
    if (id) await getDb().update(testimonials).set(values).where(eq(testimonials.id, id));
    else await getDb().insert(testimonials).values(values);
    adminDone(path, "Testimonial saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Testimonial could not be saved.");
  }
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  const path = "/admin/testimonials";
  try {
    const id = formText(formData, "id");
    const item = await getDb().query.testimonials.findFirst({ where: eq(testimonials.id, id) });
    if (item) await deleteMediaKey(item.imageKey);
    await getDb().delete(testimonials).where(eq(testimonials.id, id));
    adminDone(path, "Testimonial deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Testimonial could not be deleted.");
  }
}

export async function saveHallOfFame(formData: FormData) {
  await requireAdmin();
  const path = "/admin/hall-of-fame";
  try {
    const id = formOptionalText(formData, "id");
    const image = await uploadReplacement(formData, "image", "imageUrl", "imageKey", "hall-of-fame", "image");
    const values = {
      title: formText(formData, "title"),
      issuingBody: formText(formData, "issuingBody"),
      awardYear: asInt(formText(formData, "awardYear"), new Date().getFullYear()),
      description: formText(formData, "description"),
      imageUrl: image.url,
      imageKey: image.key,
      featured: formBoolean(formData, "featured"),
      published: formBoolean(formData, "published"),
      updatedAt: new Date()
    };
    if (!hasMinimumContent(values.title) || !hasMinimumContent(values.issuingBody)) {
      throw new Error("Award title and issuing body are required.");
    }
    if (id) await getDb().update(hallOfFame).set(values).where(eq(hallOfFame.id, id));
    else await getDb().insert(hallOfFame).values(values);
    adminDone(path, "Hall of fame entry saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Hall of fame entry could not be saved.");
  }
}

export async function deleteHallOfFame(formData: FormData) {
  await requireAdmin();
  const path = "/admin/hall-of-fame";
  try {
    const id = formText(formData, "id");
    const item = await getDb().query.hallOfFame.findFirst({ where: eq(hallOfFame.id, id) });
    if (item) await deleteMediaKey(item.imageKey);
    await getDb().delete(hallOfFame).where(eq(hallOfFame.id, id));
    adminDone(path, "Hall of fame entry deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Hall of fame entry could not be deleted.");
  }
}

export async function saveBlogPost(formData: FormData) {
  await requireAdmin();
  const path = "/admin/blogs";
  try {
    const id = formOptionalText(formData, "id");
    const title = formText(formData, "title");
    const slug = slugify(formText(formData, "slug") || title);
    const status: "draft" | "published" = formText(formData, "status") === "published" ? "published" : "draft";
    const cover = await uploadReplacement(formData, "coverImage", "coverImageUrl", "coverImageKey", `blogs/${slug}`, "image");
    const values = {
      title,
      slug,
      excerpt: formText(formData, "excerpt"),
      body: formText(formData, "body"),
      author: formText(formData, "author"),
      coverImageUrl: cover.url,
      coverImageKey: cover.key,
      status,
      publishedAt: status === "published" ? new Date() : null,
      seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
      seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
      seoMetaLink: formOptionalText(formData, "seoMetaLink"),
      seoKeywords: formOptionalText(formData, "seoKeywords"),
      updatedAt: new Date()
    };
    if (status === "published") assertPublishableBlog(values);
    if (!hasMinimumContent(title) || !hasMinimumContent(slug)) throw new Error("Blog title and slug are required.");
    if (id) await getDb().update(blogPosts).set(values).where(eq(blogPosts.id, id));
    else await getDb().insert(blogPosts).values(values);
    adminDone(path, "Blog post saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Blog post could not be saved.");
  }
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const path = "/admin/blogs";
  try {
    const id = formText(formData, "id");
    const item = await getDb().query.blogPosts.findFirst({ where: eq(blogPosts.id, id) });
    if (item) await deleteMediaKey(item.coverImageKey);
    await getDb().delete(blogPosts).where(eq(blogPosts.id, id));
    adminDone(path, "Blog post deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Blog post could not be deleted.");
  }
}

export async function saveContent(formData: FormData) {
  await requireAdmin();
  const path = "/admin/content";
  try {
    const section = formText(formData, "section");

    if (section === "homepage") {
      const [video, poster, one, two, three] = await Promise.all([
        uploadReplacement(formData, "heroVideo", "heroVideoUrl", "heroVideoKey", "homepage", "video"),
        uploadReplacement(formData, "heroPoster", "heroPosterUrl", "heroPosterKey", "homepage", "image"),
        uploadReplacement(formData, "aboutImageOne", "aboutImageOneUrl", "aboutImageOneKey", "homepage", "image"),
        uploadReplacement(formData, "aboutImageTwo", "aboutImageTwoUrl", "aboutImageTwoKey", "homepage", "image"),
        uploadReplacement(formData, "aboutImageThree", "aboutImageThreeUrl", "aboutImageThreeKey", "homepage", "image")
      ]);
      await getDb()
        .insert(homepageContent)
        .values({
          id: "homepage",
          heroTitle: formText(formData, "heroTitle"),
          heroSubtitle: formText(formData, "heroSubtitle"),
          heroVideoUrl: video.url,
          heroVideoKey: video.key,
          heroPosterUrl: poster.url,
          heroPosterKey: poster.key,
          mottoTitle: formText(formData, "mottoTitle"),
          mottoBody: formText(formData, "mottoBody"),
          aboutTitle: formText(formData, "aboutTitle"),
          aboutBody: formText(formData, "aboutBody"),
          aboutImageOneUrl: one.url,
          aboutImageOneKey: one.key,
          aboutImageTwoUrl: two.url,
          aboutImageTwoKey: two.key,
          aboutImageThreeUrl: three.url,
          aboutImageThreeKey: three.key,
          servicesTitle: formText(formData, "servicesTitle"),
          featuredPackagesTitle: formText(formData, "featuredPackagesTitle"),
          testimonialsTitle: formText(formData, "testimonialsTitle"),
          hallOfFameTitle: formText(formData, "hallOfFameTitle"),
          seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
          seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
          seoMetaLink: formOptionalText(formData, "seoMetaLink"),
          seoKeywords: formOptionalText(formData, "seoKeywords"),
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: homepageContent.id,
          set: {
            heroTitle: formText(formData, "heroTitle"),
            heroSubtitle: formText(formData, "heroSubtitle"),
            heroVideoUrl: video.url,
            heroVideoKey: video.key,
            heroPosterUrl: poster.url,
            heroPosterKey: poster.key,
            mottoTitle: formText(formData, "mottoTitle"),
            mottoBody: formText(formData, "mottoBody"),
            aboutTitle: formText(formData, "aboutTitle"),
            aboutBody: formText(formData, "aboutBody"),
            aboutImageOneUrl: one.url,
            aboutImageOneKey: one.key,
            aboutImageTwoUrl: two.url,
            aboutImageTwoKey: two.key,
            aboutImageThreeUrl: three.url,
            aboutImageThreeKey: three.key,
            servicesTitle: formText(formData, "servicesTitle"),
            featuredPackagesTitle: formText(formData, "featuredPackagesTitle"),
            testimonialsTitle: formText(formData, "testimonialsTitle"),
            hallOfFameTitle: formText(formData, "hallOfFameTitle"),
            seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
            seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
            seoMetaLink: formOptionalText(formData, "seoMetaLink"),
            seoKeywords: formOptionalText(formData, "seoKeywords"),
            updatedAt: new Date()
          }
        });
    }

    if (section === "professional") {
      const [one, two] = await Promise.all([
        uploadReplacement(formData, "imageOne", "imageOneUrl", "imageOneKey", "professional-services", "image"),
        uploadReplacement(formData, "imageTwo", "imageTwoUrl", "imageTwoKey", "professional-services", "image")
      ]);
      await getDb()
        .insert(professionalServicesContent)
        .values({
          id: "professional-services",
          title: formText(formData, "title"),
          description: formText(formData, "description"),
          imageOneUrl: one.url,
          imageOneKey: one.key,
          imageTwoUrl: two.url,
          imageTwoKey: two.key,
          ctaLabel: formText(formData, "ctaLabel"),
          ctaHref: formText(formData, "ctaHref"),
          seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
          seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
          seoMetaLink: formOptionalText(formData, "seoMetaLink"),
          seoKeywords: formOptionalText(formData, "seoKeywords"),
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: professionalServicesContent.id,
          set: {
            title: formText(formData, "title"),
            description: formText(formData, "description"),
            imageOneUrl: one.url,
            imageOneKey: one.key,
            imageTwoUrl: two.url,
            imageTwoKey: two.key,
            ctaLabel: formText(formData, "ctaLabel"),
            ctaHref: formText(formData, "ctaHref"),
            seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
            seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
            seoMetaLink: formOptionalText(formData, "seoMetaLink"),
            seoKeywords: formOptionalText(formData, "seoKeywords"),
            updatedAt: new Date()
          }
        });
    }

    if (section === "sacred") {
      const [video, poster] = await Promise.all([
        uploadReplacement(formData, "heroVideo", "heroVideoUrl", "heroVideoKey", "sacred", "video"),
        uploadReplacement(formData, "heroPoster", "heroPosterUrl", "heroPosterKey", "sacred", "image")
      ]);
      await getDb()
        .insert(sacredWingContent)
        .values({
          id: "sacred",
          heroTitle: formText(formData, "heroTitle"),
          heroSubtitle: formText(formData, "heroSubtitle"),
          heroVideoUrl: video.url,
          heroVideoKey: video.key,
          heroPosterUrl: poster.url,
          heroPosterKey: poster.key,
          servicesTitle: formText(formData, "servicesTitle"),
          servicesDescription: formText(formData, "servicesDescription"),
          expertiseTitle: formText(formData, "expertiseTitle"),
          expertiseDescription: formText(formData, "expertiseDescription"),
          contactTitle: formText(formData, "contactTitle"),
          contactBody: formText(formData, "contactBody"),
          ctaLabel: formText(formData, "ctaLabel"),
          ctaHref: formText(formData, "ctaHref"),
          seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
          seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
          seoMetaLink: formOptionalText(formData, "seoMetaLink"),
          seoKeywords: formOptionalText(formData, "seoKeywords"),
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: sacredWingContent.id,
          set: {
            heroTitle: formText(formData, "heroTitle"),
            heroSubtitle: formText(formData, "heroSubtitle"),
            heroVideoUrl: video.url,
            heroVideoKey: video.key,
            heroPosterUrl: poster.url,
            heroPosterKey: poster.key,
            servicesTitle: formText(formData, "servicesTitle"),
            servicesDescription: formText(formData, "servicesDescription"),
            expertiseTitle: formText(formData, "expertiseTitle"),
            expertiseDescription: formText(formData, "expertiseDescription"),
            contactTitle: formText(formData, "contactTitle"),
            contactBody: formText(formData, "contactBody"),
            ctaLabel: formText(formData, "ctaLabel"),
            ctaHref: formText(formData, "ctaHref"),
            seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
            seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
            seoMetaLink: formOptionalText(formData, "seoMetaLink"),
            seoKeywords: formOptionalText(formData, "seoKeywords"),
            updatedAt: new Date()
          }
        });
    }

    if (section === "site") {
      await getDb()
        .insert(siteSettings)
        .values({
          id: "site",
          aboutTitle: formText(formData, "aboutTitle"),
          aboutBody: formText(formData, "aboutBody"),
          officeAddress: formText(formData, "officeAddress"),
          contactPhone: formText(formData, "contactPhone"),
          contactEmail: formText(formData, "contactEmail"),
          instagramUrl: formOptionalText(formData, "instagramUrl"),
          facebookUrl: formOptionalText(formData, "facebookUrl"),
          linkedinUrl: formOptionalText(formData, "linkedinUrl"),
          youtubeUrl: formOptionalText(formData, "youtubeUrl"),
          footerNote: formText(formData, "footerNote"),
          seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
          seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
          seoMetaLink: formOptionalText(formData, "seoMetaLink"),
          seoKeywords: formOptionalText(formData, "seoKeywords"),
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: siteSettings.id,
          set: {
            aboutTitle: formText(formData, "aboutTitle"),
            aboutBody: formText(formData, "aboutBody"),
            officeAddress: formText(formData, "officeAddress"),
            contactPhone: formText(formData, "contactPhone"),
            contactEmail: formText(formData, "contactEmail"),
            instagramUrl: formOptionalText(formData, "instagramUrl"),
            facebookUrl: formOptionalText(formData, "facebookUrl"),
            linkedinUrl: formOptionalText(formData, "linkedinUrl"),
            youtubeUrl: formOptionalText(formData, "youtubeUrl"),
            footerNote: formText(formData, "footerNote"),
            seoMetaTitle: formOptionalText(formData, "seoMetaTitle"),
            seoMetaDescription: formOptionalText(formData, "seoMetaDescription"),
            seoMetaLink: formOptionalText(formData, "seoMetaLink"),
            seoKeywords: formOptionalText(formData, "seoKeywords"),
            updatedAt: new Date()
          }
        });
    }

    adminDone(path, "Content saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Content could not be saved.");
  }
}

export async function saveLead(formData: FormData) {
  await requireAdmin();
  const path = "/admin/leads";
  try {
    const id = formOptionalText(formData, "id");
    const statusValue = formText(formData, "status");
    const leadStatus: "new" | "contacted" | "closed" =
      statusValue === "closed" ? "closed" : statusValue === "contacted" ? "contacted" : "new";
    const values = {
      name: formText(formData, "name"),
      contactInfo: formText(formData, "contactInfo"),
      email: formText(formData, "email"),
      serviceType: formText(formData, "serviceType"),
      query: formText(formData, "query"),
      status: leadStatus,
      updatedAt: new Date()
    };
    if (id) await getDb().update(leads).set(values).where(eq(leads.id, id));
    else await getDb().insert(leads).values(values);
    adminDone(path, "Lead saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Lead could not be saved.");
  }
}

export async function deleteLead(formData: FormData) {
  await requireAdmin();
  const path = "/admin/leads";
  try {
    await getDb().delete(leads).where(eq(leads.id, formText(formData, "id")));
    adminDone(path, "Lead deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Lead could not be deleted.");
  }
}

export async function saveAdminUser(formData: FormData) {
  await requireAdmin();
  const path = "/admin/users";
  try {
    const id = formOptionalText(formData, "id");
    const password = formText(formData, "password");
    const values: {
      displayName: string;
      isActive: boolean;
      updatedAt: Date;
      passwordHash?: string;
    } = {
      displayName: formText(formData, "displayName"),
      isActive: formBoolean(formData, "isActive"),
      updatedAt: new Date()
    };
    if (!hasMinimumContent(values.displayName)) throw new Error("Display name is required.");
    if (password) values.passwordHash = await bcrypt.hash(password, 12);
    if (!id && !values.passwordHash) throw new Error("New admin users require a password.");
    if (id) await getDb().update(adminUsers).set(values).where(eq(adminUsers.id, id));
    else await getDb().insert(adminUsers).values({ ...values, passwordHash: values.passwordHash! });
    adminDone(path, "Admin user saved.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Admin user could not be saved.");
  }
}

export async function deleteAdminUser(formData: FormData) {
  await requireAdmin();
  const path = "/admin/users";
  try {
    await getDb().delete(adminUsers).where(eq(adminUsers.id, formText(formData, "id")));
    adminDone(path, "Admin user deleted.");
  } catch (error) {
    adminFail(path, error instanceof Error ? error.message : "Admin user could not be deleted.");
  }
}
