"use client";

import { useState } from "react";

import {
  CreateTaskDialog,
  type CreateTaskData,
} from "@/components/molecules/create-task-dialog";
import { KanbanBoard } from "@/components/organisms/kanban-board";
import { useProjects } from "@/hooks/use-projects";
import {
  useCreateTask,
  useDeleteTask,
  useMoveTask,
  useUpdateTask,
  useTasks,
} from "@/hooks/use-tasks";
import { useUsers } from "@/hooks/use-users";
import { useSearch } from "@/lib/search-context";

export default function DashboardPage() {
  const { query } = useSearch();
  const { data, loading } = useTasks();
  const { data: projectsData } = useProjects();
  const { data: usersData } = useUsers();
  const [createTask] = useCreateTask();
  const [updateTask] = useUpdateTask();
  const [deleteTask] = useDeleteTask();
  const [moveTask] = useMoveTask();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("todo");

  const allTasks = (data?.tasks ?? []).map((t) => ({
    ...t,
    dueDate: t.dueDate ?? null,
  }));

  const filteredTasks = query
    ? allTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          (t.description?.toLowerCase().includes(query.toLowerCase()) ??
            false) ||
          (t.assignee?.name?.toLowerCase().includes(query.toLowerCase()) ??
            false) ||
          (t.project?.name.toLowerCase().includes(query.toLowerCase()) ??
            false),
      )
    : allTasks;

  const projects =
    projectsData?.projects.map((p) => ({ id: p.id, name: p.name })) ?? [];

  const users =
    usersData?.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    })) ?? [];

  const handleAddTask = (status: string) => {
    setSelectedStatus(status);
    setDialogOpen(true);
  };

  const handleSaveTask = async (taskData: CreateTaskData) => {
    const input: Record<string, string | undefined> = {
      title: taskData.title,
      description: taskData.description || undefined,
      status: selectedStatus,
      priority: taskData.priority,
      dueDate: taskData.dueDate || undefined,
    };
    if (taskData.projectId) input.projectId = taskData.projectId;
    if (taskData.assigneeId) input.assigneeId = taskData.assigneeId;
    await createTask({ variables: { input } });
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

  const handlePriorityChange = async (id: string, priority: string) => {
    await updateTask({
      variables: { id, input: { priority } },
    });
  };

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
        tasks={filteredTasks}
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
