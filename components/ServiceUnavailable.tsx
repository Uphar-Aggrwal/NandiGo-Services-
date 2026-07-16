export function ServiceUnavailable({ detail }: { detail?: string }) {
  return (
    <section className="section narrow">
      <div className="empty-state">
        <p className="eyebrow">Service temporarily unavailable</p>
        <h1>We could not load this part of NandiGo right now.</h1>
        <p>{detail || "Please try again shortly while the content service recovers."}</p>
      </div>
    </section>
  );
}
