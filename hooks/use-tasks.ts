import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";

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
  const client = useApolloClient();

  return useMutation<
    { createTask: TaskData },
    { input: Record<string, string | undefined> }
  >(CREATE_TASK, {
    optimisticResponse(vars) {
      const existing = client.cache.readQuery<TasksQueryData>({
        query: TASKS_QUERY,
      });
      const maxOrder = Math.max(
        -1,
        ...(existing?.tasks.map((t) => t.sortOrder) ?? []),
      );
      return {
        __typename: "Mutation",
        createTask: {
          __typename: "Task",
          id: `temp-${Date.now()}`,
          title: vars.input.title ?? "",
          description: (vars.input.description as string | undefined) ?? null,
          status: (vars.input.status as string) ?? "todo",
          priority: (vars.input.priority as string) ?? "medium",
          dueDate: (vars.input.dueDate as string) ?? null,
          sortOrder: maxOrder + 1,
          assignee: null,
          project: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    },
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
    optimisticResponse() {
      return {
        __typename: "Mutation",
        deleteTask: true,
      };
    },
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
  const client = useApolloClient();

  return useMutation<
    { moveTask: TaskData },
    { id: string; status: string; sortOrder: number }
  >(MOVE_TASK, {
    optimisticResponse(vars) {
      const existing = client.cache.readQuery<TasksQueryData>({
        query: TASKS_QUERY,
      });
      const task = existing?.tasks.find((t) => t.id === vars.id);
      return {
        __typename: "Mutation",
        moveTask: {
          __typename: "Task",
          id: vars.id,
          title: task?.title ?? "",
          description: task?.description ?? null,
          status: vars.status,
          priority: task?.priority ?? "medium",
          dueDate: task?.dueDate ?? null,
          sortOrder: vars.sortOrder,
          assignee: task?.assignee ?? null,
          project: task?.project ?? null,
          createdAt: task?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    },
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
