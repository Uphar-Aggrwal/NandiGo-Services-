import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { blogPosts, categories, leads, packages, states } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const db = getDb();
  const [[stateCount], [categoryCount], [packageCount], [publishedPackageCount], [blogCount], [leadCount]] =
    await Promise.all([
      db.select({ total: count() }).from(states),
      db.select({ total: count() }).from(categories),
      db.select({ total: count() }).from(packages),
      db.select({ total: count() }).from(packages).where(eq(packages.status, "published")),
      db.select({ total: count() }).from(blogPosts),
      db.select({ total: count() }).from(leads)
    ]);

  const stats = [
    ["States", stateCount.total, "/admin/states"],
    ["Categories", categoryCount.total, "/admin/categories"],
    ["Packages", packageCount.total, "/admin/packages"],
    ["Published Packages", publishedPackageCount.total, "/admin/packages"],
    ["Blog Posts", blogCount.total, "/admin/blogs"],
    ["Leads", leadCount.total, "/admin/leads"]
  ];

  return (
    <div>
      <p className="eyebrow">Admin dashboard</p>
      <h1 className="page-title">NandiGo CMS control room.</h1>
      <div className="grid taxonomy-grid admin-section">
        {stats.map(([label, value, href]) => (
          <Link key={label} href={String(href)} className="admin-panel">
            <p className="eyebrow">{label}</p>
            <h2>{value}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
