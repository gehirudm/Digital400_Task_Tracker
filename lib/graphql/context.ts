import { prisma } from "@/lib/prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { YogaInitialContext } from "graphql-yoga";

export interface GraphQLContext {
  userId: string | null;
  prisma: typeof prisma;
  request: Request;
}

export async function createContext(
  initialContext: YogaInitialContext,
): Promise<GraphQLContext> {
  let userId: string | null = null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id && user.email) {
    // Ensure the Supabase auth user exists in the Prisma database.
    // Supabase Auth and Prisma User table are independent — we need
    // to sync the auth user into our application database.
    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        name: (user.user_metadata.name as string | undefined) ?? null,
        avatarUrl:
          (user.user_metadata.avatar_url as string | undefined) ?? null,
      },
      update: {
        email: user.email,
        name: (user.user_metadata.name as string | undefined) ?? null,
        avatarUrl:
          (user.user_metadata.avatar_url as string | undefined) ?? null,
      },
    });
    userId = user.id;
  }

  return {
    userId,
    prisma,
    request: initialContext.request as Request,
  };
}
