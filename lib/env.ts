export const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "ADMIN_PASSWORD_HASH"
] as const;

export type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

export function getMissingEnv() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());
}

export function requireEnv(key: RequiredEnvVar) {
  const value = process.env[key];
  if (!value?.trim()) {
    throw new Error(`MISSING_INPUT:${key}`);
  }
  return value;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://nandigo.in";
}
