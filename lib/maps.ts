export function isGoogleMapsUrl(value: string | null | undefined) {
  if (!value?.trim()) return false;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return (
      host === "maps.app.goo.gl" ||
      host.endsWith(".google.com") ||
      host === "google.com" ||
      host === "goo.gl"
    );
  } catch {
    return false;
  }
}

export function normalizeGoogleMapsEmbedUrl(value: string | null | undefined) {
  if (!isGoogleMapsUrl(value)) return null;
  const trimmed = value!.trim();

  try {
    const url = new URL(trimmed);
    if (url.hostname === "maps.app.goo.gl") return null;
    if (url.pathname.includes("/maps/embed")) return trimmed;
    if (url.pathname.includes("/maps")) {
      url.searchParams.set("output", "embed");
      return url.toString();
    }
    return null;
  } catch {
    return null;
  }
}
