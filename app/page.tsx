import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/atoms/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <h1 className="text-4xl font-bold tracking-tight">TaskFlow</h1>
      <p className="max-w-md text-center text-muted-foreground">
        A simple task tracker to organize your work and stay productive.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">
            Sign In <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  );
}
