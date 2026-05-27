import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";

import { TooltipProvider } from "@/components/atoms/tooltip";
import { ApolloWrapper } from "@/components/organisms/apollo-provider";
import { cn } from "@/lib/utils";

import "./globals.css";
import type { Metadata } from "next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital400 Task Tracker",
    template: "%s — Digital400",
  },
  description:
    "Kanban task management with Supabase Auth, GraphQL, and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        spaceGrotesk.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ApolloWrapper>
          <TooltipProvider>{children}</TooltipProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
