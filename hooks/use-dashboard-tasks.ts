"use client";

import { useState } from "react";

import type { CreateTaskData } from "@/components/molecules/create-task-dialog";
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

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assignee: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  } | null;
  project: {
    id: string;
    name: string;
  } | null;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface UserOption {
  id: string;
  name: string | null;
  email: string;
}

export function useDashboardTasks() {
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const allTasks = (data?.tasks ?? []).map((t) => ({
    ...t,
    dueDate: t.dueDate ?? null,
  }));

  const filteredTasks: Task[] = query
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

  const projects: ProjectOption[] =
    projectsData?.projects.map((p) => ({ id: p.id, name: p.name })) ?? [];

  const users: UserOption[] =
    usersData?.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    })) ?? [];

  const handleAddTask = (status: string) => {
    setEditingTask(null);
    setSelectedStatus(status);
    setDialogOpen(true);
  };

  const handleSaveTask = async (taskData: CreateTaskData) => {
    if (editingTask) {
      const input: Record<string, string | undefined> = {
        title: taskData.title,
        description: taskData.description || undefined,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate || undefined,
        projectId: taskData.projectId || undefined,
        assigneeId: taskData.assigneeId || undefined,
      };
      await updateTask({ variables: { id: editingTask.id, input } });
      setEditingTask(null);
    } else {
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
    }
  };

  const handleEditTask = (id: string) => {
    const task = allTasks.find((t) => t.id === id);
    if (task) {
      setEditingTask(task);
      setDialogOpen(true);
    }
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
    await updateTask({ variables: { id, input: { priority } } });
  };

  return {
    loading,
    tasks: filteredTasks,
    projects,
    users,
    dialogOpen,
    setDialogOpen,
    editingTask,
    handleAddTask,
    handleSaveTask,
    handleEditTask,
    handleDeleteTask,
    handleMoveTask,
    handlePriorityChange,
  };
}
