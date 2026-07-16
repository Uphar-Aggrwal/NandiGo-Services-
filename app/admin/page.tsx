import { redirect } from "next/navigation";
import { login } from "@/app/actions/auth";
import { isAdminAuthenticated } from "@/lib/auth";

export default function AdminLoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  if (isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <section className="section narrow">
      <form action={login} className="admin-panel admin-form">
        <p className="eyebrow">NandiGo CMS</p>
        <h1 className="page-title">Admin login</h1>
        {searchParams?.error ? <p className="notice error">{searchParams.error}</p> : null}
        <label>
          Password
          <input name="password" type="password" required minLength={8} autoComplete="current-password" />
        </label>
        <button className="button" type="submit">
          Enter admin panel
        </button>
      </form>
    </section>
  );
}
