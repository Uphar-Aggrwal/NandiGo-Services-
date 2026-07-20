import { SafeImage } from "@/components/SafeImage";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { TestimonialCard } from "@/components/TestimonialCard";
import { getTestimonialsPage } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildMetadata(
  {},
  {
    title: "Testimonials & Hall of Fame | NandiGo",
    description: "Published testimonials, reviews, awards, and hall of fame entries for NandiGo.",
    path: "/testimonials"
  }
);

export default async function TestimonialsPage() {
  try {
    const data = await getTestimonialsPage();
    return (
      <>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Testimonials</p>
            <h1 className="page-title">General traveller feedback.</h1>
          </div>
          <div className="grid testimonial-grid">
            {data.general.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </section>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Sacred wing</p>
            <h2>Spiritual VIP feedback.</h2>
          </div>
          <div className="grid testimonial-grid">
            {data.sacred.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </section>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Hall of fame</p>
            <h2>Awards and recognition.</h2>
          </div>
          <div className="grid fame-grid">
            {data.hallOfFame.map((item) => (
              <article key={item.id} className="fame-card">
                <SafeImage src={item.imageUrl} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{item.issuingBody} - {item.awardYear}</p>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
