import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { getBlogIndex } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildMetadata(
  {},
  {
    title: "NandiGo Blogs",
    description: "Published travel writing, updates, and destination notes from NandiGo.",
    path: "/blog"
  }
);

export default async function BlogPage() {
  try {
    const posts = await getBlogIndex();
    return (
      <section className="section narrow">
        <div className="section-header">
          <p className="eyebrow">Blogs</p>
          <h1 className="page-title">Published NandiGo writing.</h1>
        </div>
        <div className="grid blog-grid">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
              <SafeImage src={post.coverImageUrl} alt={post.title} />
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
