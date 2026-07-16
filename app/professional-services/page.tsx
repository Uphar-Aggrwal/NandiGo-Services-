import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RichText } from "@/components/RichText";
import { SafeImage } from "@/components/SafeImage";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { getProfessionalServicesPage } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const content = await getProfessionalServicesPage();
  if (!content) return {};
  return buildMetadata(content, {
    title: content.title,
    description: content.description,
    path: "/professional-services"
  });
}

export default async function ProfessionalServicesPage() {
  try {
    const content = await getProfessionalServicesPage();
    if (!content) return <ServiceUnavailable detail="Professional services content is not configured in the CMS." />;
    return (
      <section className="section narrow split">
        <div>
          <p className="eyebrow">Professional services</p>
          <h1 className="page-title">{content.title}</h1>
          <RichText value={content.description} />
          <Link href={content.ctaHref} className="button">
            {content.ctaLabel}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="image-collage">
          <SafeImage src={content.imageOneUrl} alt={content.title} />
          <SafeImage src={content.imageTwoUrl} alt={content.title} />
        </div>
      </section>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
