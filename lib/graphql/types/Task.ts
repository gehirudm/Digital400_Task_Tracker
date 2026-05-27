import { builder } from "../builder";

export const PriorityEnum = builder.enumType("Priority", {
  values: ["low", "medium", "high"] as const,
});

export const TaskStatusEnum = builder.enumType("TaskStatus", {
  values: ["todo", "in_progress", "done"] as const,
});

export const TaskType = builder.objectRef<{
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  sortOrder: number;
  assigneeId: string | null;
  projectId: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignee?: Record<string, unknown> | null;
  project?: Record<string, unknown> | null;
}>("Task");
