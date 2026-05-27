"use client";

import { CreateTaskDialog } from "@/components/molecules/create-task-dialog";
import { KanbanBoard } from "@/components/organisms/kanban-board";
import { useDashboardTasks } from "@/hooks/use-dashboard-tasks";

export default function DashboardPage() {
  const {
    loading,
    tasks,
    projects,
    users,
    dialogOpen,
    setDialogOpen,
    handleAddTask,
    handleSaveTask,
    handleEditTask,
    handleDeleteTask,
    handleMoveTask,
    handlePriorityChange,
  } = useDashboardTasks();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <>
      <KanbanBoard
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
        onMoveTask={handleMoveTask}
        onPriorityChange={handlePriorityChange}
        tasks={tasks}
      />
      <CreateTaskDialog
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
        open={dialogOpen}
        projects={projects}
        users={users}
      />
    </>
  );
}
