export function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function formOptionalText(formData: FormData, key: string) {
  const value = formText(formData, key);
  return value.length > 0 ? value : null;
}

export function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export function lineList(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseItinerary(value: string) {
  return lineList(value).map((line, index) => {
    const [day, title, ...descriptionParts] = line.split("|").map((part) => part.trim());
    return {
      day: day || `Day ${index + 1}`,
      title: title || `Journey segment ${index + 1}`,
      description: descriptionParts.join(" | ") || title || day || ""
    };
  });
}

export function parseActivityTable(value: string) {
  return lineList(value).map((line) => {
    const [time, activity, ...notesParts] = line.split("|").map((part) => part.trim());
    return {
      time: time || "Flexible",
      activity: activity || "",
      notes: notesParts.join(" | ")
    };
  });
}

export function parseFaqs(value: string) {
  return lineList(value).map((line) => {
    const [question, ...answerParts] = line.split("|").map((part) => part.trim());
    return {
      question: question || "",
      answer: answerParts.join(" | ")
    };
  });
}

export function itineraryToText(
  value: Array<{ day: string; title: string; description: string }> | null | undefined
) {
  return (value ?? []).map((item) => `${item.day} | ${item.title} | ${item.description}`).join("\n");
}

export function activityToText(
  value: Array<{ time: string; activity: string; notes: string }> | null | undefined
) {
  return (value ?? []).map((item) => `${item.time} | ${item.activity} | ${item.notes}`).join("\n");
}

export function faqsToText(value: Array<{ question: string; answer: string }> | null | undefined) {
  return (value ?? []).map((item) => `${item.question} | ${item.answer}`).join("\n");
}

export function listToText(value: string[] | null | undefined) {
  return (value ?? []).join("\n");
}
