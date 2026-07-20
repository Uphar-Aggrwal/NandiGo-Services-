import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";
import { PackageCard } from "@/components/PackageCard";
import { RichText } from "@/components/RichText";
import { SafeImage } from "@/components/SafeImage";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { TestimonialCard } from "@/components/TestimonialCard";
import { getHomePageData } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  try {
    const data = await getHomePageData();
    if (!data.home) {
      return buildMetadata({}, { title: "NandiGo", description: "Curated India travel experiences by NandiGo." });
    }
    return buildMetadata(data.home, {
      title: "NandiGo | Destination Management Company",
      description: data.home.heroSubtitle,
      path: "/"
    });
  } catch {
    return buildMetadata({}, { title: "NandiGo", description: "Curated India travel experiences by NandiGo." });
  }
}

export default async function HomePage() {
  try {
    const data = await getHomePageData();
    if (!data.home) return <ServiceUnavailable detail="Homepage content is not configured in the CMS." />;

    return (
      <>
        <HeroVideo
          title={data.home.heroTitle}
          subtitle={data.home.heroSubtitle}
          videoUrl={data.home.heroVideoUrl}
          posterUrl={data.home.heroPosterUrl}
        />
        <section id="main-content" className="section narrow split">
          <div className="split-text">
            <p className="eyebrow">NandiGo motto</p>
            <h2>{data.home.mottoTitle}</h2>
            <RichText value={data.home.mottoBody} />
          </div>
          <div className="image-collage" aria-label="NandiGo visual highlights">
            <SafeImage src={data.home.aboutImageOneUrl} alt={data.home.aboutTitle} />
            <SafeImage src={data.home.aboutImageTwoUrl} alt={data.home.aboutTitle} />
            <SafeImage src={data.home.aboutImageThreeUrl} alt={data.home.aboutTitle} />
          </div>
        </section>

        <section className="section media-band">
          <div className="narrow split">
            <div>
              <p className="eyebrow">About</p>
              <h2>{data.home.aboutTitle}</h2>
              <RichText value={data.home.aboutBody} />
            </div>
            <Link href="/about" className="button secondary">
              Read about NandiGo
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Services</p>
            <h2>{data.home.servicesTitle}</h2>
          </div>
          <div className="grid taxonomy-grid">
            {data.states.map((state) => (
              <Link key={state.id} href={`/destinations/${state.slug}`} className="taxonomy-card">
                <SafeImage src={state.cardImageUrl || state.heroPosterUrl} alt={state.name} />
                <div>
                  <h3>{state.name}</h3>
                  <p>{state.summary}</p>
                </div>
              </Link>
            ))}
            {data.categories.map((category) => (
              <Link key={category.id} href={`/experiences/${category.slug}`} className="taxonomy-card">
                <SafeImage src={category.cardImageUrl || category.heroPosterUrl} alt={category.name} />
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.summary}</p>
                </div>
              </Link>
            ))}
            {data.professional ? (
              <Link href="/professional-services" className="taxonomy-card">
                <div className="hero-brand-panel">
                  <BriefcaseBusiness size={60} aria-hidden="true" />
                </div>
                <div>
                  <h3>{data.professional.title}</h3>
                  <p>{data.professional.description}</p>
                </div>
              </Link>
            ) : null}
          </div>
        </section>

        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Featured packages</p>
            <h2>{data.home.featuredPackagesTitle}</h2>
          </div>
          {data.featuredPackages.length ? (
            <div className="grid package-grid">
              {data.featuredPackages.map((item) => (
                <PackageCard key={item.id} packageItem={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">Catalog awaiting publication</p>
              <h1>Featured tours will appear after admins publish packages.</h1>
            </div>
          )}
        </section>

        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Testimonials</p>
            <h2>{data.home.testimonialsTitle}</h2>
          </div>
          <div className="grid testimonial-grid">
            {data.testimonials.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Hall of fame</p>
            <h2>{data.home.hallOfFameTitle}</h2>
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

        <section className="section narrow">
          <div className="section-header">
            <p className="eyebrow">Blogs</p>
            <h2>Latest writing from NandiGo.</h2>
          </div>
          <div className="grid blog-grid">
            {data.blogs.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                <SafeImage src={post.coverImageUrl} alt={post.title} />
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
