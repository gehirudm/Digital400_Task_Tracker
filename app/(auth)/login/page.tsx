"use client";

import { useRouter } from "next/navigation";

import { AuthCard } from "@/components/organisms/auth-card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleEmailSignIn = async (data: {
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw error;
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
      onEmailSubmit={handleEmailSignIn}
      onSocialLogin={handleSocialLogin}
    />
  );
}
