import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { RichText } from "@/components/RichText";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  if (!settings) return {};
  return buildMetadata(settings, {
    title: settings.aboutTitle,
    description: settings.aboutBody,
    path: "/about"
  });
}

export default async function AboutPage() {
  try {
    const settings = await getSiteSettings();
    if (!settings) return <ServiceUnavailable detail="About content is not configured in the CMS." />;
    return (
      <section className="section narrow split">
        <div>
          <p className="eyebrow">About</p>
          <h1 className="page-title">{settings.aboutTitle}</h1>
          <RichText value={settings.aboutBody} />
        </div>
        <div className="admin-panel">
          <h2>Contact information</h2>
          <p>{settings.officeAddress}</p>
          <p>{settings.contactPhone}</p>
          <p>{settings.contactEmail}</p>
          <div className="route-row">
            {settings.instagramUrl ? <a href={settings.instagramUrl}>Instagram</a> : null}
            {settings.facebookUrl ? <a href={settings.facebookUrl}>Facebook</a> : null}
            {settings.linkedinUrl ? <a href={settings.linkedinUrl}>LinkedIn</a> : null}
            {settings.youtubeUrl ? <a href={settings.youtubeUrl}>YouTube</a> : null}
          </div>
        </div>
      </section>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
