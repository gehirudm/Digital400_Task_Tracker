import { Users } from "lucide-react";

import { EmptyState } from "@/components/molecules/empty-state";

export default function TeamPage() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <EmptyState
        actionLabel="Invite Members"
        description="Collaborate with your team."
        icon={<Users className="h-10 w-10" />}
        title="No team members yet"
      />
    </div>
  );
}
