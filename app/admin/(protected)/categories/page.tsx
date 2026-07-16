import { asc } from "drizzle-orm";
import { deleteCategory, saveCategory } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { MediaHiddenFields } from "@/components/admin/MediaHiddenFields";
import { SeoFields } from "@/components/admin/SeoFields";
import { getDb } from "@/lib/db";
import { categories } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type CategoryItem = typeof categories.$inferSelect;

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams?: { notice?: string; error?: string };
}) {
  const items = await getDb().query.categories.findMany({
    orderBy: [asc(categories.displayOrder), asc(categories.name)]
  });

  return (
    <div>
      <p className="eyebrow">Browse by Experience</p>
      <h1 className="page-title">Categories</h1>
      <AdminNotice searchParams={searchParams} />
      <details className="admin-item" open>
        <summary>Create category</summary>
        <CategoryForm />
      </details>
      <div className="admin-section">
        {items.map((item) => (
          <details key={item.id} className="admin-item">
            <summary>
              <span>{item.name}</span>
              <span>{item.isActive ? "Active" : "Hidden"}</span>
            </summary>
            <CategoryForm item={item} />
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="button danger">
                Delete category
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function CategoryForm({ item }: { item?: CategoryItem }) {
  return (
    <form action={saveCategory} className="admin-panel admin-form">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <MediaHiddenFields
        values={{
          heroVideoUrl: item?.heroVideoUrl,
          heroVideoKey: item?.heroVideoKey,
          heroPosterUrl: item?.heroPosterUrl,
          heroPosterKey: item?.heroPosterKey,
          cardImageUrl: item?.cardImageUrl,
          cardImageKey: item?.cardImageKey
        }}
      />
      <div className="field-grid">
        <label>
          Name
          <input name="name" defaultValue={item?.name ?? ""} required />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={item?.slug ?? ""} />
        </label>
        <label>
          Display Order
          <input name="displayOrder" type="number" defaultValue={item?.displayOrder ?? 0} />
        </label>
        <label>
          Visible in public nav
          <input name="isActive" type="checkbox" defaultChecked={item?.isActive ?? true} />
        </label>
      </div>
      <label>
        Summary
        <textarea name="summary" defaultValue={item?.summary ?? ""} />
      </label>
      <label>
        Description
        <textarea name="description" defaultValue={item?.description ?? ""} />
      </label>
      <label>
        Vibe Text
        <textarea name="vibeText" defaultValue={item?.vibeText ?? ""} />
      </label>
      <div className="field-grid">
        <label>
          Hero Video MP4
          <input name="heroVideo" type="file" accept="video/mp4" />
        </label>
        <label>
          Hero Poster WebP
          <input name="heroPoster" type="file" accept="image/webp" />
        </label>
        <label>
          Card Image WebP
          <input name="cardImage" type="file" accept="image/webp" />
        </label>
      </div>
      <SeoFields item={item} />
      <button className="button" type="submit">
        Save category
      </button>
    </form>
  );
}
