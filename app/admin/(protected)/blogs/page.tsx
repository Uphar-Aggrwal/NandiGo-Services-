import { desc } from "drizzle-orm";
import { deleteBlogPost, saveBlogPost } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { MediaHiddenFields } from "@/components/admin/MediaHiddenFields";
import { SeoFields } from "@/components/admin/SeoFields";
import { getDb } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type BlogItem = typeof blogPosts.$inferSelect;

export default async function AdminBlogsPage({ searchParams }: { searchParams?: { notice?: string; error?: string } }) {
  const items = await getDb().query.blogPosts.findMany({ orderBy: [desc(blogPosts.updatedAt)] });

  return (
    <div>
      <p className="eyebrow">Draft and published writing</p>
      <h1 className="page-title">Blogs</h1>
      <AdminNotice searchParams={searchParams} />
      <details className="admin-item" open>
        <summary>Create blog post</summary>
        <BlogForm />
      </details>
      <div className="admin-section">
        {items.map((item) => (
          <details key={item.id} className="admin-item">
            <summary>
              <span>{item.title}</span>
              <span>{item.status}</span>
            </summary>
            <BlogForm item={item} />
            <form action={deleteBlogPost}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="button danger">
                Delete blog post
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function BlogForm({ item }: { item?: BlogItem }) {
  return (
    <form action={saveBlogPost} className="admin-panel admin-form">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <MediaHiddenFields values={{ coverImageUrl: item?.coverImageUrl, coverImageKey: item?.coverImageKey }} />
      <div className="field-grid">
        <label>
          Title
          <input name="title" defaultValue={item?.title ?? ""} />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={item?.slug ?? ""} />
        </label>
        <label>
          Author
          <input name="author" defaultValue={item?.author ?? ""} />
        </label>
        <label>
          Status
          <select name="status" defaultValue={item?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>
      <label>
        Excerpt
        <textarea name="excerpt" defaultValue={item?.excerpt ?? ""} />
      </label>
      <label>
        Body
        <textarea name="body" defaultValue={item?.body ?? ""} />
      </label>
      <label>
        Cover Image WebP
        <input name="coverImage" type="file" accept="image/webp" />
      </label>
      <SeoFields item={item} />
      <button type="submit" className="button">
        Save blog post
      </button>
    </form>
  );
}
