import { prisma } from "@/lib/prisma/client";

import { builder } from "./builder";
import { ProjectType } from "./types/Project";
import { TaskType } from "./types/Task";
import { UserType } from "./types/User";

builder.queryField("me", (t) =>
  t.field({
    type: UserType,
    nullable: true,
    resolve: async (_root, _args, ctx) => {
      if (!ctx.userId) {
        return null;
      }
      return prisma.user.findUnique({
        where: { id: ctx.userId },
      });
    },
  }),
);

builder.queryField("tasks", (t) =>
  t.field({
    type: [TaskType],
    args: {
      status: t.arg.string({ required: false }),
      projectId: t.arg.string({ required: false }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.userId) {
        return [];
      }
      return prisma.task.findMany({
        where: {
          ...(args.status ? { status: args.status } : {}),
          ...(args.projectId ? { projectId: args.projectId } : {}),
        },
        include: { assignee: true, project: true },
        orderBy: { sortOrder: "asc" },
      });
    },
  }),
);

builder.queryField("task", (t) =>
  t.field({
    type: TaskType,
    nullable: true,
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      if (!ctx.userId) {
        return null;
      }
      return prisma.task.findUnique({
        where: { id: args.id },
        include: { assignee: true, project: true },
      });
    },
  }),
);

builder.queryField("projects", (t) =>
  t.field({
    type: [ProjectType],
    resolve: async (_root, _args, ctx) => {
      if (!ctx.userId) {
        return [];
      }
      return prisma.project.findMany({
        where: { ownerId: ctx.userId },
        include: {
          owner: true,
          tasks: { include: { assignee: true, project: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    },
  }),
);
