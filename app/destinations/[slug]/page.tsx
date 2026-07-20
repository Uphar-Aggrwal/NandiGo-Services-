import { notFound } from "next/navigation";
import { HeroVideo } from "@/components/HeroVideo";
import { PackageCard } from "@/components/PackageCard";
import { RichText } from "@/components/RichText";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { getStatePage } from "@/lib/data";
import { normalizeGoogleMapsEmbedUrl } from "@/lib/maps";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const data = await getStatePage(params.slug);
    if (!data) return {};
    return buildMetadata(data.state, {
      title: `${data.state.name} Packages | NandiGo`,
      description: data.state.summary,
      path: `/destinations/${data.state.slug}`
    });
  } catch {
    return buildMetadata({}, {
      title: "NandiGo Destination",
      description: "NandiGo destination details are temporarily unavailable.",
      path: `/destinations/${params.slug}`
    });
  }
}

export default async function StatePage({ params }: { params: { slug: string } }) {
  try {
    const data = await getStatePage(params.slug);
    if (!data) notFound();
    const mapUrl = normalizeGoogleMapsEmbedUrl(data.state.mapEmbedUrl);

    return (
      <>
        <HeroVideo
          title={data.state.name}
          subtitle={data.state.summary}
          videoUrl={data.state.heroVideoUrl}
          posterUrl={data.state.heroPosterUrl}
        />
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Destination vibe</p>
            <h2>{data.state.vibeText}</h2>
          </div>
          <RichText value={data.state.description} />
        </section>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Packages in {data.state.name}</p>
            <h2>One destination page, many independent experience paths.</h2>
          </div>
          {data.packages.length ? (
            <div className="grid package-grid">
              {data.packages.map((item) => (
                <PackageCard key={item.id} packageItem={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">No published packages</p>
              <h1>Published {data.state.name} packages will appear here.</h1>
            </div>
          )}
        </section>
        {mapUrl ? (
          <section className="section narrow">
            <iframe className="map-frame" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </section>
        ) : null}
      </>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
