import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";

type PackageCardProps = {
  packageItem: {
    name: string;
    slug: string;
    description: string;
    price: string;
    durationDays: number;
    state?: { name: string; slug: string } | null;
    category?: { name: string; slug: string } | null;
    images?: Array<{ url: string; altText: string; sortOrder: number }> | null;
  };
};

export function PackageCard({ packageItem }: PackageCardProps) {
  const image = packageItem.images?.sort((a, b) => a.sortOrder - b.sortOrder)[0];

  return (
    <article className="package-card">
      <SafeImage src={image?.url} alt={image?.altText || packageItem.name} className="package-card-image" />
      <div className="package-card-body">
        <div className="meta-row">
          {packageItem.state ? (
            <span>
              <MapPin size={14} aria-hidden="true" />
              {packageItem.state.name}
            </span>
          ) : null}
          <span>
            <CalendarDays size={14} aria-hidden="true" />
            {packageItem.durationDays} days
          </span>
        </div>
        <h3>{packageItem.name}</h3>
        {packageItem.category ? <p className="tagline">{packageItem.category.name}</p> : null}
        <p>{packageItem.description}</p>
        <div className="card-footer">
          <strong>{packageItem.price}</strong>
          <Link href={`/packages/${packageItem.slug}`} className="icon-link" aria-label={`Open ${packageItem.name}`}>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
