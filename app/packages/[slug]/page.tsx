import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroVideo } from "@/components/HeroVideo";
import { RichText } from "@/components/RichText";
import { SafeImage } from "@/components/SafeImage";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { getPackagePage } from "@/lib/data";
import { normalizeGoogleMapsEmbedUrl } from "@/lib/maps";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getPackagePage(params.slug);
  if (!item) return {};
  return buildMetadata(item, {
    title: `${item.name} | NandiGo`,
    description: item.description,
    path: `/packages/${item.slug}`
  });
}

export default async function PackagePage({ params }: { params: { slug: string } }) {
  try {
    const item = await getPackagePage(params.slug);
    if (!item) notFound();
    const mapUrl = normalizeGoogleMapsEmbedUrl(item.mapEmbedUrl);

    return (
      <>
        <HeroVideo
          title={item.name}
          subtitle={item.description}
          posterUrl={item.images?.[0]?.url}
          ctaHref="#package-detail"
        />
        <section id="package-detail" className="section narrow">
          <div className="route-row">
            <Link href={`/destinations/${item.state.slug}`} className="button secondary">
              {item.state.name}
            </Link>
            <Link href={`/experiences/${item.category.slug}`} className="button secondary">
              {item.category.name}
            </Link>
            <strong>{item.price}</strong>
            <span>{item.durationDays} days</span>
          </div>
        </section>
        <section className="section narrow">
          <div className="image-collage">
            {(item.images ?? []).map((image) => (
              <SafeImage key={image.id} src={image.url} alt={image.altText} />
            ))}
          </div>
        </section>
        <section className="section narrow split">
          <div>
            <p className="eyebrow">Highlights</p>
            <h2 className="page-title">From {item.startingLocation} to {item.endingLocation}.</h2>
          </div>
          <ul className="rich-text">
            {item.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Day-wise itinerary</p>
            <h2>Route, rhythm, and experience flow.</h2>
          </div>
          <div className="grid">
            {item.itinerary.map((day) => (
              <article key={`${day.day}-${day.title}`} className="itinerary-item">
                <p className="eyebrow">{day.day}</p>
                <h3>{day.title}</h3>
                <p>{day.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Activity table</p>
            <h2>Daily movement at a glance.</h2>
          </div>
          <table className="activity-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Activity</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {item.activityTable.map((row) => (
                <tr key={`${row.time}-${row.activity}`}>
                  <td>{row.time}</td>
                  <td>{row.activity}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {mapUrl ? (
          <section className="section narrow">
            <iframe className="map-frame" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </section>
        ) : null}
        <section className="section narrow">
          <div className="policy-grid">
            <section>
              <h2>Inclusions</h2>
              <RichText value={item.inclusions} />
            </section>
            <section>
              <h2>Exclusions</h2>
              <RichText value={item.exclusions} />
            </section>
            <section>
              <h2>Payment Terms</h2>
              <RichText value={item.paymentTerms} />
            </section>
            <section>
              <h2>Cancellation & Refund Policy</h2>
              <RichText value={item.cancellationPolicy} />
            </section>
            <section>
              <h2>Traveller Responsibility</h2>
              <RichText value={item.travellerResponsibility} />
            </section>
          </div>
        </section>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">FAQs</p>
            <h2>Questions travellers ask before booking.</h2>
          </div>
          <div className="grid">
            {item.faqs.map((faq) => (
              <article key={faq.question} className="itinerary-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
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
