import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";
import { RichText } from "@/components/RichText";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { TestimonialCard } from "@/components/TestimonialCard";
import { getSacredPageData } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const data = await getSacredPageData();
  if (!data.content) return {};
  return buildMetadata(data.content, {
    title: data.content.heroTitle,
    description: data.content.heroSubtitle,
    path: "/sacred"
  });
}

export default async function SacredPage() {
  try {
    const data = await getSacredPageData();
    if (!data.content) return <ServiceUnavailable detail="Sacred wing content is not configured in the CMS." />;
    return (
      <>
        <HeroVideo
          sacred
          title={data.content.heroTitle}
          subtitle={data.content.heroSubtitle}
          videoUrl={data.content.heroVideoUrl}
          posterUrl={data.content.heroPosterUrl}
          ctaLabel="Enter sacred services"
        />
        <section id="main-content" className="section narrow split">
          <div>
            <p className="eyebrow">Sacred services</p>
            <h2>{data.content.servicesTitle}</h2>
            <RichText value={data.content.servicesDescription} />
          </div>
          <div>
            <p className="eyebrow">Expertise</p>
            <h2>{data.content.expertiseTitle}</h2>
            <RichText value={data.content.expertiseDescription} />
          </div>
        </section>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Sacred testimonials</p>
            <h2>Feedback separated from the public wing.</h2>
          </div>
          <div className="grid testimonial-grid">
            {data.testimonials.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </section>
        <section className="section media-band">
          <div className="narrow split">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>{data.content.contactTitle}</h2>
              <RichText value={data.content.contactBody} />
            </div>
            <Link href={data.content.ctaHref} className="button secondary">
              {data.content.ctaLabel}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
