import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/auth";

const links = [
  ["Dashboard", "/admin/dashboard"],
  ["States", "/admin/states"],
  ["Categories", "/admin/categories"],
  ["Packages", "/admin/packages"],
  ["Content", "/admin/content"],
  ["Testimonials", "/admin/testimonials"],
  ["Hall of Fame", "/admin/hall-of-fame"],
  ["Blogs", "/admin/blogs"],
  ["Leads", "/admin/leads"],
  ["Admin Users", "/admin/users"]
];

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  requireAdmin();

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="brand">
          <img src="/nandigo-logo.png" alt="NandiGo logo" />
          <span>NandiGo CMS</span>
        </Link>
        <nav>
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button className="button secondary" type="submit">
            Logout
          </button>
        </form>
      </aside>
      <div className="admin-main">{children}</div>
    </section>
  );
}
