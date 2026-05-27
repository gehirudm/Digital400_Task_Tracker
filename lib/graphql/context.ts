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
  userId = user?.id ?? null;

  return {
    userId,
    prisma,
    request: initialContext.request as Request,
  };
}
