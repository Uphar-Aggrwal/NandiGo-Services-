import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "nandigo_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function sessionSecret() {
  return process.env.ADMIN_PASSWORD_HASH || "missing-admin-password-hash";
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

export function createSessionCookieValue() {
  const payload = `${Date.now()}:${randomBytes(16).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionCookie(value: string | undefined) {
  if (!value || !value.includes(".")) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const age = Date.now() - Number(payload.split(":")[0]);
  if (!Number.isFinite(age) || age > MAX_AGE_SECONDS * 1000) return false;

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function setAdminSession() {
  cookies().set(COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminAuthenticated() {
  return isValidSessionCookie(cookies().get(COOKIE_NAME)?.value);
}

export function requireAdmin() {
  if (!isAdminAuthenticated()) {
    redirect("/admin");
  }
}
