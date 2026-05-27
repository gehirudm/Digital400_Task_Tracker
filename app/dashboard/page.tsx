"use client";

import { KanbanBoard } from "@/components/organisms/kanban-board";

export default function DashboardPage() {
  return (
    <KanbanBoard
      onAddTask={() => undefined}
      onDeleteTask={() => undefined}
      onEditTask={() => undefined}
      onMoveTask={() => undefined}
      tasks={[]}
    />
  );
}
