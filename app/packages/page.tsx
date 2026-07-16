import { PackageCard } from "@/components/PackageCard";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { getAllPackages } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildMetadata(
  {},
  {
    title: "NandiGo Package Catalog",
    description: "Browse all published NandiGo packages across states and experiences.",
    path: "/packages"
  }
);

export default async function PackagesPage() {
  try {
    const packageRows = await getAllPackages();
    return (
      <section className="section narrow">
        <div className="section-header">
          <p className="eyebrow">Full catalog</p>
          <h1 className="page-title">Published NandiGo packages.</h1>
        </div>
        <div className="grid package-grid">
          {packageRows.map((item) => (
            <PackageCard key={item.id} packageItem={item} />
          ))}
        </div>
      </section>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
