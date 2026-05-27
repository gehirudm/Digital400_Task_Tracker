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
  return useMutation(CREATE_TASK, {
    refetchQueries: [TASKS_QUERY],
  });
}

export function useUpdateTask() {
  return useMutation(UPDATE_TASK, {
    refetchQueries: [TASKS_QUERY],
  });
}

export function useDeleteTask() {
  return useMutation(DELETE_TASK, {
    refetchQueries: [TASKS_QUERY],
  });
}

export function useMoveTask() {
  return useMutation(MOVE_TASK, {
    refetchQueries: [TASKS_QUERY],
  });
}
