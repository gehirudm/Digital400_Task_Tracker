import { useMutation, useQuery } from "@apollo/client/react";

import {
  CREATE_TASK,
  DELETE_TASK,
  MOVE_TASK,
  TASKS_QUERY,
  UPDATE_TASK,
} from "@/lib/graphql/operations/tasks";

interface TaskData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  sortOrder: number;
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
  createdAt: string;
  updatedAt: string;
}

interface TasksQueryData {
  tasks: TaskData[];
}

export function useTasks(status?: string, projectId?: string) {
  return useQuery<TasksQueryData>(TASKS_QUERY, {
    variables: { status, projectId },
  });
}

export function useCreateTask() {
  return useMutation<
    { createTask: TaskData },
    { input: Record<string, string | undefined> }
  >(CREATE_TASK, {
    update(cache, { data }) {
      const created = data?.createTask;
      if (!created) return;

      const existing = cache.readQuery<TasksQueryData>({ query: TASKS_QUERY });
      if (!existing) return;

      cache.writeQuery<TasksQueryData>({
        query: TASKS_QUERY,
        data: { tasks: [created, ...existing.tasks] },
      });
    },
  });
}

export function useUpdateTask() {
  return useMutation<
    { updateTask: TaskData },
    { id: string; input: Record<string, string | undefined> }
  >(UPDATE_TASK, {
    update(cache, { data }) {
      const updated = data?.updateTask;
      if (!updated) return;

      const existing = cache.readQuery<TasksQueryData>({ query: TASKS_QUERY });
      if (!existing) return;

      cache.writeQuery<TasksQueryData>({
        query: TASKS_QUERY,
        data: {
          tasks: existing.tasks.map((t) => (t.id === updated.id ? updated : t)),
        },
      });
    },
  });
}

export function useDeleteTask() {
  return useMutation<{ deleteTask: boolean }, { id: string }>(DELETE_TASK, {
    update(cache, _, { variables }) {
      if (!variables?.id) return;

      const existing = cache.readQuery<TasksQueryData>({ query: TASKS_QUERY });
      if (!existing) return;

      cache.writeQuery<TasksQueryData>({
        query: TASKS_QUERY,
        data: { tasks: existing.tasks.filter((t) => t.id !== variables.id) },
      });
    },
  });
}

export function useMoveTask() {
  return useMutation<
    { moveTask: TaskData },
    { id: string; status: string; sortOrder: number }
  >(MOVE_TASK, {
    update(cache, { data }) {
      const moved = data?.moveTask;
      if (!moved) return;

      const existing = cache.readQuery<TasksQueryData>({ query: TASKS_QUERY });
      if (!existing) return;

      cache.writeQuery<TasksQueryData>({
        query: TASKS_QUERY,
        data: {
          tasks: existing.tasks.map((t) =>
            t.id === moved.id
              ? { ...t, status: moved.status, sortOrder: moved.sortOrder }
              : t,
          ),
        },
      });
    },
  });
}
