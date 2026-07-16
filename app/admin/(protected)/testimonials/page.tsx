import { desc } from "drizzle-orm";
import { deleteTestimonial, saveTestimonial } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { MediaHiddenFields } from "@/components/admin/MediaHiddenFields";
import { getDb } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type TestimonialItem = typeof testimonials.$inferSelect;

export default async function AdminTestimonialsPage({
  searchParams
}: {
  searchParams?: { notice?: string; error?: string };
}) {
  const items = await getDb().query.testimonials.findMany({
    orderBy: [desc(testimonials.featured), desc(testimonials.updatedAt)]
  });

  return (
    <div>
      <p className="eyebrow">General and Sacred separation</p>
      <h1 className="page-title">Testimonials</h1>
      <AdminNotice searchParams={searchParams} />
      <details className="admin-item" open>
        <summary>Create testimonial</summary>
        <TestimonialForm />
      </details>
      <div className="admin-section">
        {items.map((item) => (
          <details key={item.id} className="admin-item">
            <summary>
              <span>{item.reviewerName}</span>
              <span>{item.wing}</span>
            </summary>
            <TestimonialForm item={item} />
            <form action={deleteTestimonial}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="button danger">
                Delete testimonial
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function TestimonialForm({ item }: { item?: TestimonialItem }) {
  return (
    <form action={saveTestimonial} className="admin-panel admin-form">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <MediaHiddenFields values={{ imageUrl: item?.imageUrl, imageKey: item?.imageKey }} />
      <div className="field-grid">
        <label>
          Wing
          <select name="wing" defaultValue={item?.wing ?? "general"}>
            <option value="general">General</option>
            <option value="sacred">Sacred</option>
          </select>
        </label>
        <label>
          Reviewer Name
          <input name="reviewerName" defaultValue={item?.reviewerName ?? ""} />
        </label>
        <label>
          Role or Location
          <input name="roleOrLocation" defaultValue={item?.roleOrLocation ?? ""} />
        </label>
        <label>
          Rating
          <input name="rating" type="number" min="1" max="5" defaultValue={item?.rating ?? 5} />
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
        Quote
        <textarea name="quote" defaultValue={item?.quote ?? ""} />
      </label>
      <label>
        Image WebP
        <input name="image" type="file" accept="image/webp" />
      </label>
      <button type="submit" className="button">
        Save testimonial
      </button>
    </form>
  );
}
