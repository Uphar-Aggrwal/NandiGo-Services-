import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { requireEnv } from "@/lib/env";
import * as schema from "./schema";

let client: postgres.Sql | null = null;
let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!client) {
    client = postgres(requireEnv("DATABASE_URL"), {
      max: 5,
      connect_timeout: 2,
      idle_timeout: 20
    });
  }

  if (!cachedDb) {
    cachedDb = drizzle(client, { schema });
  }

  return cachedDb;
}
