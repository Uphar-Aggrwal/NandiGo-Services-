import Link from "next/link";
import { ArrowDown } from "lucide-react";

type HeroVideoProps = {
  title: string;
  subtitle: string;
  videoUrl?: string | null;
  posterUrl?: string | null;
  ctaHref?: string;
  ctaLabel?: string;
  sacred?: boolean;
};

export function HeroVideo({
  title,
  subtitle,
  videoUrl,
  posterUrl,
  ctaHref = "#main-content",
  ctaLabel = "Explore more",
  sacred
}: HeroVideoProps) {
  return (
    <section className={`hero ${sacred ? "hero-sacred" : ""}`}>
      {videoUrl ? (
        <video autoPlay muted loop playsInline poster={posterUrl || "/nandigo-logo.png"} className="hero-media">
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div className="hero-media hero-brand-panel" aria-hidden="true">
          <img src="/nandigo-logo.png" alt="" />
        </div>
      )}
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow">{sacred ? "Sacred wing" : "Destination management company"}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <Link href={ctaHref} className="hero-explore">
          <span>{ctaLabel}</span>
          <ArrowDown aria-hidden="true" size={20} />
        </Link>
      </div>
    </section>
  );
}
