import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export async function Footer() {
  let settings = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <img src="/nandigo-logo.png" alt="NandiGo logo" className="footer-logo" />
          <p>{settings?.footerNote || "NandiGo"}</p>
        </div>
        <div>
          <h2>Company</h2>
          <Link href="/about">About</Link>
          <Link href="/blog">Blogs</Link>
          <Link href="/testimonials">Testimonials</Link>
          <Link href="/lets-connect">Let's Connect</Link>
        </div>
        <div>
          <h2>Contact</h2>
          <p>{settings?.officeAddress || "India"}</p>
          <p>{settings?.contactPhone || ""}</p>
          <p>{settings?.contactEmail || ""}</p>
        </div>
      </div>
    </footer>
  );
}
