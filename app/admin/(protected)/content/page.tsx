import { saveContent } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { MediaHiddenFields } from "@/components/admin/MediaHiddenFields";
import { SeoFields } from "@/components/admin/SeoFields";
import { getDb } from "@/lib/db";
import { homepageContent, professionalServicesContent, sacredWingContent, siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminContentPage({
  searchParams
}: {
  searchParams?: { notice?: string; error?: string };
}) {
  const [home, professional, sacred, site] = await Promise.all([
    getDb().query.homepageContent.findFirst({ where: eq(homepageContent.id, "homepage") }),
    getDb().query.professionalServicesContent.findFirst({ where: eq(professionalServicesContent.id, "professional-services") }),
    getDb().query.sacredWingContent.findFirst({ where: eq(sacredWingContent.id, "sacred") }),
    getDb().query.siteSettings.findFirst({ where: eq(siteSettings.id, "site") })
  ]);

  return (
    <div>
      <p className="eyebrow">Editable website fields</p>
      <h1 className="page-title">Content</h1>
      <AdminNotice searchParams={searchParams} />

      <details className="admin-item" open>
        <summary>Homepage content</summary>
        <form action={saveContent} className="admin-panel admin-form">
          <input type="hidden" name="section" value="homepage" />
          <MediaHiddenFields
            values={{
              heroVideoUrl: home?.heroVideoUrl,
              heroVideoKey: home?.heroVideoKey,
              heroPosterUrl: home?.heroPosterUrl,
              heroPosterKey: home?.heroPosterKey,
              aboutImageOneUrl: home?.aboutImageOneUrl,
              aboutImageOneKey: home?.aboutImageOneKey,
              aboutImageTwoUrl: home?.aboutImageTwoUrl,
              aboutImageTwoKey: home?.aboutImageTwoKey,
              aboutImageThreeUrl: home?.aboutImageThreeUrl,
              aboutImageThreeKey: home?.aboutImageThreeKey
            }}
          />
          <div className="field-grid">
            <label>
              Hero Title
              <input name="heroTitle" defaultValue={home?.heroTitle ?? ""} />
            </label>
            <label>
              Hero Subtitle
              <textarea name="heroSubtitle" defaultValue={home?.heroSubtitle ?? ""} />
            </label>
          </div>
          <div className="field-grid">
            <label>
              Hero Video MP4
              <input name="heroVideo" type="file" accept="video/mp4" />
            </label>
            <label>
              Hero Poster WebP
              <input name="heroPoster" type="file" accept="image/webp" />
            </label>
          </div>
          <div className="field-grid">
            <label>
              Motto Title
              <input name="mottoTitle" defaultValue={home?.mottoTitle ?? ""} />
            </label>
            <label>
              Motto Body
              <textarea name="mottoBody" defaultValue={home?.mottoBody ?? ""} />
            </label>
          </div>
          <div className="field-grid">
            <label>
              About Title
              <input name="aboutTitle" defaultValue={home?.aboutTitle ?? ""} />
            </label>
            <label>
              About Body
              <textarea name="aboutBody" defaultValue={home?.aboutBody ?? ""} />
            </label>
          </div>
          <div className="field-grid">
            <label>
              About Image One WebP
              <input name="aboutImageOne" type="file" accept="image/webp" />
            </label>
            <label>
              About Image Two WebP
              <input name="aboutImageTwo" type="file" accept="image/webp" />
            </label>
            <label>
              About Image Three WebP
              <input name="aboutImageThree" type="file" accept="image/webp" />
            </label>
          </div>
          <div className="field-grid">
            <label>
              Services Title
              <input name="servicesTitle" defaultValue={home?.servicesTitle ?? ""} />
            </label>
            <label>
              Featured Packages Title
              <input name="featuredPackagesTitle" defaultValue={home?.featuredPackagesTitle ?? ""} />
            </label>
            <label>
              Testimonials Title
              <input name="testimonialsTitle" defaultValue={home?.testimonialsTitle ?? ""} />
            </label>
            <label>
              Hall of Fame Title
              <input name="hallOfFameTitle" defaultValue={home?.hallOfFameTitle ?? ""} />
            </label>
          </div>
          <SeoFields item={home} />
          <button className="button" type="submit">
            Save homepage
          </button>
        </form>
      </details>

      <details className="admin-item">
        <summary>Professional services content</summary>
        <form action={saveContent} className="admin-panel admin-form">
          <input type="hidden" name="section" value="professional" />
          <MediaHiddenFields
            values={{
              imageOneUrl: professional?.imageOneUrl,
              imageOneKey: professional?.imageOneKey,
              imageTwoUrl: professional?.imageTwoUrl,
              imageTwoKey: professional?.imageTwoKey
            }}
          />
          <label>
            Title
            <input name="title" defaultValue={professional?.title ?? ""} />
          </label>
          <label>
            Description
            <textarea name="description" defaultValue={professional?.description ?? ""} />
          </label>
          <div className="field-grid">
            <label>
              Image One WebP
              <input name="imageOne" type="file" accept="image/webp" />
            </label>
            <label>
              Image Two WebP
              <input name="imageTwo" type="file" accept="image/webp" />
            </label>
            <label>
              CTA Label
              <input name="ctaLabel" defaultValue={professional?.ctaLabel ?? ""} />
            </label>
            <label>
              CTA Link
              <input name="ctaHref" defaultValue={professional?.ctaHref ?? "/lets-connect"} />
            </label>
          </div>
          <SeoFields item={professional} />
          <button className="button" type="submit">
            Save professional services
          </button>
        </form>
      </details>

      <details className="admin-item">
        <summary>Sacred wing content</summary>
        <form action={saveContent} className="admin-panel admin-form">
          <input type="hidden" name="section" value="sacred" />
          <MediaHiddenFields
            values={{
              heroVideoUrl: sacred?.heroVideoUrl,
              heroVideoKey: sacred?.heroVideoKey,
              heroPosterUrl: sacred?.heroPosterUrl,
              heroPosterKey: sacred?.heroPosterKey
            }}
          />
          <div className="field-grid">
            <label>
              Hero Title
              <input name="heroTitle" defaultValue={sacred?.heroTitle ?? ""} />
            </label>
            <label>
              Hero Subtitle
              <textarea name="heroSubtitle" defaultValue={sacred?.heroSubtitle ?? ""} />
            </label>
            <label>
              Hero Video MP4
              <input name="heroVideo" type="file" accept="video/mp4" />
            </label>
            <label>
              Hero Poster WebP
              <input name="heroPoster" type="file" accept="image/webp" />
            </label>
          </div>
          <div className="field-grid">
            <label>
              Services Title
              <input name="servicesTitle" defaultValue={sacred?.servicesTitle ?? ""} />
            </label>
            <label>
              Services Description
              <textarea name="servicesDescription" defaultValue={sacred?.servicesDescription ?? ""} />
            </label>
            <label>
              Expertise Title
              <input name="expertiseTitle" defaultValue={sacred?.expertiseTitle ?? ""} />
            </label>
            <label>
              Expertise Description
              <textarea name="expertiseDescription" defaultValue={sacred?.expertiseDescription ?? ""} />
            </label>
            <label>
              Contact Title
              <input name="contactTitle" defaultValue={sacred?.contactTitle ?? ""} />
            </label>
            <label>
              Contact Body
              <textarea name="contactBody" defaultValue={sacred?.contactBody ?? ""} />
            </label>
            <label>
              CTA Label
              <input name="ctaLabel" defaultValue={sacred?.ctaLabel ?? ""} />
            </label>
            <label>
              CTA Link
              <input name="ctaHref" defaultValue={sacred?.ctaHref ?? "/lets-connect"} />
            </label>
          </div>
          <SeoFields item={sacred} />
          <button className="button" type="submit">
            Save sacred wing
          </button>
        </form>
      </details>

      <details className="admin-item">
        <summary>About, contact, socials, and footer</summary>
        <form action={saveContent} className="admin-panel admin-form">
          <input type="hidden" name="section" value="site" />
          <label>
            About Title
            <input name="aboutTitle" defaultValue={site?.aboutTitle ?? ""} />
          </label>
          <label>
            About Body
            <textarea name="aboutBody" defaultValue={site?.aboutBody ?? ""} />
          </label>
          <div className="field-grid">
            <label>
              Office Address
              <textarea name="officeAddress" defaultValue={site?.officeAddress ?? ""} />
            </label>
            <label>
              Contact Phone
              <input name="contactPhone" defaultValue={site?.contactPhone ?? ""} />
            </label>
            <label>
              Contact Email
              <input name="contactEmail" defaultValue={site?.contactEmail ?? ""} />
            </label>
          </div>
          <div className="field-grid">
            <label>
              Instagram URL
              <input name="instagramUrl" defaultValue={site?.instagramUrl ?? ""} />
            </label>
            <label>
              Facebook URL
              <input name="facebookUrl" defaultValue={site?.facebookUrl ?? ""} />
            </label>
            <label>
              LinkedIn URL
              <input name="linkedinUrl" defaultValue={site?.linkedinUrl ?? ""} />
            </label>
            <label>
              YouTube URL
              <input name="youtubeUrl" defaultValue={site?.youtubeUrl ?? ""} />
            </label>
          </div>
          <label>
            Footer Note
            <textarea name="footerNote" defaultValue={site?.footerNote ?? ""} />
          </label>
          <SeoFields item={site} />
          <button className="button" type="submit">
            Save site settings
          </button>
        </form>
      </details>
    </div>
  );
}
