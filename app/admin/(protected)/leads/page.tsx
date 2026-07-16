import { desc } from "drizzle-orm";
import { deleteLead, saveLead } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type LeadItem = typeof leads.$inferSelect;

export default async function AdminLeadsPage({ searchParams }: { searchParams?: { notice?: string; error?: string } }) {
  const items = await getDb().query.leads.findMany({ orderBy: [desc(leads.createdAt)] });

  return (
    <div>
      <p className="eyebrow">Lead inbox</p>
      <h1 className="page-title">Leads</h1>
      <AdminNotice searchParams={searchParams} />
      <details className="admin-item">
        <summary>Create lead manually</summary>
        <LeadForm />
      </details>
      <div className="admin-section">
        {items.map((item) => (
          <details key={item.id} className="admin-item">
            <summary>
              <span>{item.name}</span>
              <span>{item.status}</span>
            </summary>
            <LeadForm item={item} />
            <form action={deleteLead}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="button danger">
                Delete lead
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function LeadForm({ item }: { item?: LeadItem }) {
  return (
    <form action={saveLead} className="admin-panel admin-form">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field-grid">
        <label>
          Name
          <input name="name" defaultValue={item?.name ?? ""} />
        </label>
        <label>
          Contact Info
          <input name="contactInfo" defaultValue={item?.contactInfo ?? ""} />
        </label>
        <label>
          Email
          <input name="email" defaultValue={item?.email ?? ""} />
        </label>
        <label>
          Service Type
          <input name="serviceType" defaultValue={item?.serviceType ?? ""} />
        </label>
        <label>
          Status
          <select name="status" defaultValue={item?.status ?? "new"}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </label>
      </div>
      <label>
        Query
        <textarea name="query" defaultValue={item?.query ?? ""} />
      </label>
      <button type="submit" className="button">
        Save lead
      </button>
    </form>
  );
}
