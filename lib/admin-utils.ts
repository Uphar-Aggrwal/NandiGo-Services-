import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export function adminDone(path: string, message: string) {
  revalidatePath("/", "layout");
  redirect(`${path}?notice=${encodeURIComponent(message)}`);
}

export function adminFail(path: string, message: string) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export function asInt(value: string, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) return value;
  return null;
}

export function getFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is File => value instanceof File && value.size > 0);
}
