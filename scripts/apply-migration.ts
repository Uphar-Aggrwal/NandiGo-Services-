import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("MISSING_INPUT:DATABASE_URL");
  process.exit(1);
}

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 10,
  idle_timeout: 5
});

async function main() {
  try {
    const migration = await readFile(resolve("drizzle/0001_nandigo_cms.sql"), "utf8");
    await sql.unsafe(migration);
    console.log("NandiGo migration applied.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
