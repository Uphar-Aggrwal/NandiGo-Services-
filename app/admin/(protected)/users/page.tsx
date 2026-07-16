import { desc } from "drizzle-orm";
import { deleteAdminUser, saveAdminUser } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { getDb } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type AdminUserItem = typeof adminUsers.$inferSelect;

export default async function AdminUsersPage({ searchParams }: { searchParams?: { notice?: string; error?: string } }) {
  const items = await getDb().query.adminUsers.findMany({ orderBy: [desc(adminUsers.updatedAt)] });

  return (
    <div>
      <p className="eyebrow">Optional CMS passwords</p>
      <h1 className="page-title">Admin Users</h1>
      <p className="help-text">
        The deployment password hash remains controlled by ADMIN_PASSWORD_HASH. Rows here add extra password-only access
        options without changing the public website.
      </p>
      <AdminNotice searchParams={searchParams} />
      <details className="admin-item" open>
        <summary>Create admin user</summary>
        <AdminUserForm />
      </details>
      <div className="admin-section">
        {items.map((item) => (
          <details key={item.id} className="admin-item">
            <summary>
              <span>{item.displayName}</span>
              <span>{item.isActive ? "Active" : "Inactive"}</span>
            </summary>
            <AdminUserForm item={item} />
            <form action={deleteAdminUser}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="button danger">
                Delete admin user
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function AdminUserForm({ item }: { item?: AdminUserItem }) {
  return (
    <form action={saveAdminUser} className="admin-panel admin-form">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field-grid">
        <label>
          Display Name
          <input name="displayName" defaultValue={item?.displayName ?? ""} />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength={8} />
          <span className="help-text">Leave blank when editing unless you want to replace this user's password.</span>
        </label>
        <label>
          Active
          <input name="isActive" type="checkbox" defaultChecked={item?.isActive ?? true} />
        </label>
      </div>
      <button type="submit" className="button">
        Save admin user
      </button>
    </form>
  );
}
