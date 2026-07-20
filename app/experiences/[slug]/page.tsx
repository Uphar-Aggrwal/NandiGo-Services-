import { notFound } from "next/navigation";
import { HeroVideo } from "@/components/HeroVideo";
import { PackageCard } from "@/components/PackageCard";
import { RichText } from "@/components/RichText";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { getCategoryPage } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const data = await getCategoryPage(params.slug);
    if (!data) return {};
    return buildMetadata(data.category, {
      title: `${data.category.name} Packages | NandiGo`,
      description: data.category.summary,
      path: `/experiences/${data.category.slug}`
    });
  } catch {
    return buildMetadata({}, {
      title: "NandiGo Experience",
      description: "NandiGo experience details are temporarily unavailable.",
      path: `/experiences/${params.slug}`
    });
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  try {
    const data = await getCategoryPage(params.slug);
    if (!data) notFound();

    return (
      <>
        <HeroVideo
          title={data.category.name}
          subtitle={data.category.summary}
          videoUrl={data.category.heroVideoUrl}
          posterUrl={data.category.heroPosterUrl}
        />
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Experience vibe</p>
            <h2>{data.category.vibeText}</h2>
          </div>
          <RichText value={data.category.description} />
        </section>
        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Packages for {data.category.name}</p>
            <h2>One experience page, many independent state paths.</h2>
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
              <h1>Published {data.category.name} packages will appear here.</h1>
            </div>
          )}
        </section>
      </>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
