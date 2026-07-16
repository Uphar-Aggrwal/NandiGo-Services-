import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section narrow">
      <div className="empty-state">
        <p className="eyebrow">Not found</p>
        <h1>This NandiGo page is not available.</h1>
        <p>The page may be unpublished, archived, or moved.</p>
        <Link href="/" className="button">
          Return home
        </Link>
      </div>
    </section>
  );
}
