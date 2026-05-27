"use client";

import { KanbanBoard } from "@/components/organisms/kanban-board";

const noop = () => undefined;

export default function DashboardPage() {
  return (
    <KanbanBoard
      onAddTask={noop}
      onDeleteTask={noop}
      onEditTask={noop}
      onMoveTask={noop}
      tasks={[]}
    />
  );
}
