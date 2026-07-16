import { asc } from "drizzle-orm";
import { deleteState, saveState } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { MediaHiddenFields } from "@/components/admin/MediaHiddenFields";
import { SeoFields } from "@/components/admin/SeoFields";
import { getDb } from "@/lib/db";
import { states } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type StateItem = typeof states.$inferSelect;

export default async function AdminStatesPage({ searchParams }: { searchParams?: { notice?: string; error?: string } }) {
  const items = await getDb().query.states.findMany({ orderBy: [asc(states.displayOrder), asc(states.name)] });

  return (
    <div>
      <p className="eyebrow">Browse by State</p>
      <h1 className="page-title">States</h1>
      <AdminNotice searchParams={searchParams} />
      <details className="admin-item" open>
        <summary>Create state</summary>
        <StateForm />
      </details>
      <div className="admin-section">
        {items.map((item) => (
          <details key={item.id} className="admin-item">
            <summary>
              <span>{item.name}</span>
              <span>{item.isActive ? "Active" : "Hidden"}</span>
            </summary>
            <StateForm item={item} />
            <form action={deleteState}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="button danger">
                Delete state
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function StateForm({ item }: { item?: StateItem }) {
  return (
    <form action={saveState} className="admin-panel admin-form">
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
          <span className="help-text">MP4 only, 10MB max. Rendered autoplay muted loop playsinline.</span>
        </label>
        <label>
          Hero Poster WebP
          <input name="heroPoster" type="file" accept="image/webp" />
          <span className="help-text">WebP only, 2MB max.</span>
        </label>
        <label>
          Card Image WebP
          <input name="cardImage" type="file" accept="image/webp" />
        </label>
      </div>
      <label>
        Google Maps URL
        <input name="mapEmbedUrl" defaultValue={item?.mapEmbedUrl ?? ""} />
      </label>
      <SeoFields item={item} />
      <button className="button" type="submit">
        Save state
      </button>
    </form>
  );
}
