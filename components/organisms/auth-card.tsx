"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";
import { AuthForm } from "@/components/molecules/auth-form";
import { SocialAuthButton } from "@/components/molecules/social-auth-button";

interface AuthCardProps {
  defaultMode?: "login" | "signup";
  onEmailSubmit: (data: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  onSocialLogin: (provider: "google" | "github") => void;
  loading?: { email: boolean; google: boolean; github: boolean };
}

export function AuthCard({
  defaultMode = "login",
  onEmailSubmit,
  onSocialLogin,
  loading,
}: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to your account to continue"
            : "Enter your details to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <SocialAuthButton
            loading={loading?.google}
            onClick={() => onSocialLogin("google")}
            provider="google"
          />
          <SocialAuthButton
            loading={loading?.github}
            onClick={() => onSocialLogin("github")}
            provider="github"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <AuthForm mode={mode} onSubmit={onEmailSubmit} />

        <p className="text-center text-xs text-muted-foreground">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            className="font-medium underline underline-offset-4 hover:text-primary"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            type="button"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
