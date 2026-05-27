import { FolderOpen } from "lucide-react";

import { EmptyState } from "@/components/molecules/empty-state";

export default function ProjectsPage() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <EmptyState
        actionLabel="Create Project"
        description="Organize your tasks into projects."
        icon={<FolderOpen className="h-10 w-10" />}
        title="No projects yet"
      />
    </div>
  );
}
