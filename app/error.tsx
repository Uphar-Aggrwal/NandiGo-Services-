"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section narrow">
      <div className="empty-state">
        <p className="eyebrow">Service temporarily unavailable</p>
        <h1>NandiGo could not complete this request.</h1>
        <p>The content service did not respond cleanly. Please retry once.</p>
        <button className="button" onClick={() => reset()}>
          Retry
        </button>
      </div>
    </section>
  );
}
