"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { clearAdminSession, setAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { requireEnv } from "@/lib/env";
import { formText } from "@/lib/form-parsers";

export async function login(formData: FormData) {
  const password = formText(formData, "password");
  const envHash = requireEnv("ADMIN_PASSWORD_HASH");
  let accepted = await bcrypt.compare(password, envHash);

  if (!accepted) {
    try {
      const users = await getDb().select().from(adminUsers).where(eq(adminUsers.isActive, true));
      for (const user of users) {
        if (await bcrypt.compare(password, user.passwordHash)) {
          accepted = true;
          await getDb()
            .update(adminUsers)
            .set({ lastLoginAt: new Date(), updatedAt: new Date() })
            .where(eq(adminUsers.id, user.id));
          break;
        }
      }
    } catch {
      accepted = false;
    }
  }

  if (!accepted) {
    redirect("/admin?error=Invalid%20admin%20password.");
  }

  setAdminSession();
  redirect("/admin/dashboard");
}

export async function logout() {
  clearAdminSession();
  redirect("/admin");
}
