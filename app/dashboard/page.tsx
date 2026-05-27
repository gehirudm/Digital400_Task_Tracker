"use client";

import { KanbanBoard } from "@/components/organisms/kanban-board";
import {
  useCreateTask,
  useDeleteTask,
  useMoveTask,
  useTasks,
} from "@/hooks/use-tasks";

export default function DashboardPage() {
  const { data, loading } = useTasks();
  const [createTask] = useCreateTask();
  const [deleteTask] = useDeleteTask();
  const [moveTask] = useMoveTask();

  const tasks = (data?.tasks ?? []).map((t) => ({
    ...t,
    dueDate: t.dueDate ?? null,
  }));

  const handleAddTask = async (status: string) => {
    await createTask({
      variables: {
        input: { title: "New Task", status, priority: "medium" },
      },
    });
  };

  const handleEditTask = (id: string) => {
    void id;
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask({ variables: { id } });
  };

  const handleMoveTask = async (
    id: string,
    status: string,
    sortOrder: number,
  ) => {
    await moveTask({ variables: { id, status, sortOrder } });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <KanbanBoard
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      onEditTask={handleEditTask}
      onMoveTask={handleMoveTask}
      tasks={tasks}
    />
  );
}
