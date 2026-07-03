"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserService, UserUpdate } from "@/lib/services/user.service";
import { userUpdateSchema } from "@/schemas/user.schema";

export async function updateUserAction(id: string, updates: UserUpdate) {
  const session = await getServerSession(authOptions);
  
  // Security check: must be authenticated and updating own profile
  if (!session?.user?.id || session.user.id !== id) {
    throw new Error("Unauthorized");
  }

  // Zod Validation
  const validatedUpdates = userUpdateSchema.parse(updates) as UserUpdate;

  // Execute Service using Admin Client
  const adminClient = createAdminClient();
  const userService = new UserService(adminClient);
  
  return userService.updateUser(id, validatedUpdates);
}
