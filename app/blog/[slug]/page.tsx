import { notFound } from "next/navigation";
import { RichText } from "@/components/RichText";
import { SafeImage } from "@/components/SafeImage";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { getBlogPost } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPost(params.slug);
    if (!post) return {};
    return buildMetadata(post, {
      title: `${post.title} | NandiGo`,
      description: post.excerpt,
      path: `/blog/${post.slug}`
    });
  } catch {
    return buildMetadata({}, {
      title: "NandiGo Blog",
      description: "NandiGo blog details are temporarily unavailable.",
      path: `/blog/${params.slug}`
    });
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPost(params.slug);
    if (!post) notFound();
    return (
      <article className="section narrow">
        <p className="eyebrow">{post.author}</p>
        <h1 className="page-title">{post.title}</h1>
        <p>{post.excerpt}</p>
        <SafeImage src={post.coverImageUrl} alt={post.title} className="package-card-image" />
        <RichText value={post.body} />
      </article>
    );
  } catch {
    return <ServiceUnavailable />;
  }
}
