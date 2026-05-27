"use client";

import { useRouter } from "next/navigation";

import { AuthCard } from "@/components/organisms/auth-card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleEmailSignUp = async (data: {
    email: string;
    password: string;
    name?: string;
  }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });

    if (error) {
      if (
        error.message?.includes("already registered") ||
        error.message?.includes("already exists")
      ) {
        throw new Error(
          "An account with this email already exists. Please sign in instead.",
        );
      }
      throw error;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/callback` },
    });
  };

  return (
    <AuthCard
      mode="signup"
      onEmailSubmit={handleEmailSignUp}
      onSocialLogin={handleSocialLogin}
    />
  );
}
