const required = [
  "DATABASE_URL",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "ADMIN_PASSWORD_HASH"
];

const missing = required.filter((key) => !process.env[key] || process.env[key].trim() === "");

if (missing.length > 0) {
  for (const key of missing) {
    console.error(`MISSING_INPUT:${key}`);
  }
  process.exit(1);
}
