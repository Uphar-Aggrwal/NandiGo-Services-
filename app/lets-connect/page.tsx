import { submitLead } from "@/app/actions/leads";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata(
  {},
  {
    title: "Let's Connect | NandiGo",
    description: "Send a travel, package, professional services, or sacred wing query to NandiGo.",
    path: "/lets-connect"
  }
);

export default function LetsConnectPage({
  searchParams
}: {
  searchParams?: { notice?: string; error?: string };
}) {
  return (
    <section className="section narrow split">
      <div>
        <p className="eyebrow">Let's Connect</p>
        <h1 className="page-title">Tell NandiGo what kind of journey you want.</h1>
        <p>
          Your query is written directly into the admin leads table with status new, so the team can filter and follow up.
        </p>
      </div>
      <form action={submitLead} className="contact-form admin-panel">
        {searchParams?.notice ? <p className="notice">{searchParams.notice}</p> : null}
        {searchParams?.error ? <p className="notice error">{searchParams.error}</p> : null}
        <label>
          Name
          <input name="name" required minLength={2} />
        </label>
        <label>
          Contact Info
          <input name="contactInfo" required minLength={2} />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Service Type
          <select name="serviceType" required>
            <option value="General Travel">General Travel</option>
            <option value="Package Query">Package Query</option>
            <option value="Professional Services">Professional Services</option>
            <option value="Sacred VIP Wing">Sacred VIP Wing</option>
            <option value="Custom Journey">Custom Journey</option>
          </select>
        </label>
        <label>
          Query
          <textarea name="query" required minLength={2} />
        </label>
        <button className="button" type="submit">
          Send query
        </button>
      </form>
    </section>
  );
}
