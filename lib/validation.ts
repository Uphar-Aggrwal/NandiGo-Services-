import { normalizeGoogleMapsEmbedUrl } from "@/lib/maps";

export function hasMinimumContent(value: string | null | undefined, min = 2) {
  return Boolean(value && value.trim().length >= min);
}

export function assertPublishablePackage(input: {
  name: string;
  description: string;
  price: string;
  durationDays: number;
  startingLocation: string;
  endingLocation: string;
  highlights: string[];
  itinerary: Array<{ day: string; title: string; description: string }>;
  activityTable: Array<{ time: string; activity: string; notes: string }>;
  inclusions: string;
  exclusions: string;
  paymentTerms: string;
  cancellationPolicy: string;
  faqs: Array<{ question: string; answer: string }>;
  travellerResponsibility: string;
  mapEmbedUrl: string | null;
}) {
  const missing: string[] = [];
  const textFields: Array<[string, string]> = [
    ["Package name", input.name],
    ["Description", input.description],
    ["Price", input.price],
    ["Starting location", input.startingLocation],
    ["Ending location", input.endingLocation],
    ["Inclusions", input.inclusions],
    ["Exclusions", input.exclusions],
    ["Payment terms", input.paymentTerms],
    ["Cancellation policy", input.cancellationPolicy],
    ["Traveller responsibility", input.travellerResponsibility]
  ];

  for (const [label, value] of textFields) {
    if (!hasMinimumContent(value)) missing.push(label);
  }

  if (!Number.isFinite(input.durationDays) || input.durationDays < 1) missing.push("Days to cover");
  if (input.highlights.length === 0 || input.highlights.some((item) => !hasMinimumContent(item))) {
    missing.push("Highlights");
  }
  if (
    input.itinerary.length === 0 ||
    input.itinerary.some(
      (item) => !hasMinimumContent(item.day) || !hasMinimumContent(item.title) || !hasMinimumContent(item.description)
    )
  ) {
    missing.push("Day-wise itinerary");
  }
  if (
    input.activityTable.length === 0 ||
    input.activityTable.some((item) => !hasMinimumContent(item.activity))
  ) {
    missing.push("Activity table");
  }
  if (
    input.faqs.length === 0 ||
    input.faqs.some((item) => !hasMinimumContent(item.question) || !hasMinimumContent(item.answer))
  ) {
    missing.push("FAQs");
  }
  if (input.mapEmbedUrl && !normalizeGoogleMapsEmbedUrl(input.mapEmbedUrl)) {
    missing.push("Valid Google Maps embed/share URL");
  }

  if (missing.length > 0) {
    throw new Error(`Cannot publish. Complete these fields first: ${missing.join(", ")}.`);
  }
}

export function assertPublishableBlog(input: { title: string; excerpt: string; body: string; author: string }) {
  const missing = [
    ["Title", input.title],
    ["Excerpt", input.excerpt],
    ["Body", input.body],
    ["Author", input.author]
  ]
    .filter(([, value]) => !hasMinimumContent(value))
    .map(([label]) => label);

  if (missing.length > 0) {
    throw new Error(`Cannot publish. Complete these fields first: ${missing.join(", ")}.`);
  }
}
