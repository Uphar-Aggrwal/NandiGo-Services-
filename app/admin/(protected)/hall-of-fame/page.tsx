import { desc } from "drizzle-orm";
import { deleteHallOfFame, saveHallOfFame } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { MediaHiddenFields } from "@/components/admin/MediaHiddenFields";
import { getDb } from "@/lib/db";
import { hallOfFame } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type FameItem = typeof hallOfFame.$inferSelect;

export default async function AdminHallOfFamePage({
  searchParams
}: {
  searchParams?: { notice?: string; error?: string };
}) {
  const items = await getDb().query.hallOfFame.findMany({
    orderBy: [desc(hallOfFame.featured), desc(hallOfFame.awardYear)]
  });

  return (
    <div>
      <p className="eyebrow">Awards and certificates</p>
      <h1 className="page-title">Hall of Fame</h1>
      <AdminNotice searchParams={searchParams} />
      <details className="admin-item" open>
        <summary>Create hall of fame entry</summary>
        <FameForm />
      </details>
      <div className="admin-section">
        {items.map((item) => (
          <details key={item.id} className="admin-item">
            <summary>
              <span>{item.title}</span>
              <span>{item.awardYear}</span>
            </summary>
            <FameForm item={item} />
            <form action={deleteHallOfFame}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="button danger">
                Delete entry
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function FameForm({ item }: { item?: FameItem }) {
  return (
    <form action={saveHallOfFame} className="admin-panel admin-form">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <MediaHiddenFields values={{ imageUrl: item?.imageUrl, imageKey: item?.imageKey }} />
      <div className="field-grid">
        <label>
          Title
          <input name="title" defaultValue={item?.title ?? ""} />
        </label>
        <label>
          Issuing Body
          <input name="issuingBody" defaultValue={item?.issuingBody ?? ""} />
        </label>
        <label>
          Award Year
          <input name="awardYear" type="number" defaultValue={item?.awardYear ?? new Date().getFullYear()} />
        </label>
        <label>
          Featured
          <input name="featured" type="checkbox" defaultChecked={item?.featured ?? false} />
        </label>
        <label>
          Published
          <input name="published" type="checkbox" defaultChecked={item?.published ?? true} />
        </label>
      </div>
      <label>
        Description
        <textarea name="description" defaultValue={item?.description ?? ""} />
      </label>
      <label>
        Image WebP
        <input name="image" type="file" accept="image/webp" />
      </label>
      <button type="submit" className="button">
        Save hall of fame entry
      </button>
    </form>
  );
}
