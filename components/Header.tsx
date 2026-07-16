import Link from "next/link";
import { ChevronDown, Crown, Home, Mail, Menu, PenLine, Sparkles, Star } from "lucide-react";
import { getNavigationData } from "@/lib/data";

export async function Header() {
  let nav = { states: [] as Array<{ name: string; slug: string }>, categories: [] as Array<{ name: string; slug: string }> };

  try {
    nav = await getNavigationData();
  } catch {
    nav = { states: [], categories: [] };
  }

  return (
    <header className="site-header">
      <div className="top-strip">
        <span>Connect with NandiGo</span>
        <Link href="/sacred" className="wing-link">
          <Crown size={15} aria-hidden="true" />
          Sacred VIP
        </Link>
      </div>
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link href="/" className="brand">
          <img src="/nandigo-logo.png" alt="NandiGo logo" />
          <span>NandiGo</span>
        </Link>

        <details className="mobile-menu">
          <summary>
            <Menu size={22} aria-hidden="true" />
            Menu
          </summary>
          <div className="mobile-menu-panel">
            <NavLinks states={nav.states} categories={nav.categories} />
          </div>
        </details>

        <div className="desktop-nav">
          <NavLinks states={nav.states} categories={nav.categories} />
        </div>
      </nav>
    </header>
  );
}

function NavLinks({
  states,
  categories
}: {
  states: Array<{ name: string; slug: string }>;
  categories: Array<{ name: string; slug: string }>;
}) {
  return (
    <>
      <Link href="/">
        <Home size={16} aria-hidden="true" />
        Home
      </Link>
      <details className="services-menu">
        <summary>
          <Sparkles size={16} aria-hidden="true" />
          Our Services
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="mega-menu">
          <div>
            <h3>Browse by State</h3>
            {states.length ? (
              states.map((item) => (
                <Link key={item.slug} href={`/destinations/${item.slug}`}>
                  {item.name}
                </Link>
              ))
            ) : (
              <span className="muted">State catalog not configured</span>
            )}
          </div>
          <div>
            <h3>Browse by Experience</h3>
            {categories.length ? (
              categories.map((item) => (
                <Link key={item.slug} href={`/experiences/${item.slug}`}>
                  {item.name}
                </Link>
              ))
            ) : (
              <span className="muted">Experience catalog not configured</span>
            )}
          </div>
          <div>
            <h3>Professional Services</h3>
            <Link href="/professional-services">Events, Conferences & Corporate</Link>
            <Link href="/packages">Full Package Catalog</Link>
          </div>
        </div>
      </details>
      <Link href="/blog">
        <PenLine size={16} aria-hidden="true" />
        Blogs
      </Link>
      <Link href="/testimonials">
        <Star size={16} aria-hidden="true" />
        Testimonials
      </Link>
      <Link href="/about">About</Link>
      <Link href="/lets-connect" className="primary-nav-link">
        <Mail size={16} aria-hidden="true" />
        Let's Connect
      </Link>
    </>
  );
}
