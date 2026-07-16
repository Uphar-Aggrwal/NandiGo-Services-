"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { formText } from "@/lib/form-parsers";
import { hasMinimumContent } from "@/lib/validation";

export async function submitLead(formData: FormData) {
  const input = {
    name: formText(formData, "name"),
    contactInfo: formText(formData, "contactInfo"),
    email: formText(formData, "email"),
    serviceType: formText(formData, "serviceType"),
    query: formText(formData, "query")
  };

  if (
    !hasMinimumContent(input.name) ||
    !hasMinimumContent(input.contactInfo) ||
    !hasMinimumContent(input.email) ||
    !hasMinimumContent(input.serviceType) ||
    !hasMinimumContent(input.query)
  ) {
    redirect("/lets-connect?error=Please%20complete%20every%20field%20with%20meaningful%20content.");
  }

  await getDb().insert(leads).values({ ...input, status: "new" });
  redirect("/lets-connect?notice=Your%20query%20has%20been%20sent%20to%20NandiGo.");
}
