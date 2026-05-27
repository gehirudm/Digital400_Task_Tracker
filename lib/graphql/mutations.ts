import { prisma } from "@/lib/prisma/client";

import { builder } from "./builder";
import { ProjectType } from "./types/Project";
import { TaskType } from "./types/Task";

const CreateTaskInput = builder.inputType("CreateTaskInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string({ required: false }),
    status: t.string({ required: false }),
    priority: t.string({ required: false }),
    dueDate: t.string({ required: false }),
    assigneeId: t.string({ required: false }),
    projectId: t.string({ required: false }),
  }),
});

const UpdateTaskInput = builder.inputType("UpdateTaskInput", {
  fields: (t) => ({
    title: t.string({ required: false }),
    description: t.string({ required: false }),
    status: t.string({ required: false }),
    priority: t.string({ required: false }),
    dueDate: t.string({ required: false }),
    assigneeId: t.string({ required: false }),
    projectId: t.string({ required: false }),
  }),
});

builder.mutationField("createTask", (t1) =>
  t1.field({
    type: TaskType,
    args: { input: t1.arg({ type: CreateTaskInput, required: true }) },
    resolve: async (_root, args, ctx) => {
      if (!ctx.userId) {
        throw new Error("Unauthorized");
      }
      const maxSort = await prisma.task.aggregate({
        _max: { sortOrder: true },
        where: { projectId: args.input.projectId ?? null },
      });
      return prisma.task.create({
        data: {
          title: args.input.title,
          description: args.input.description ?? null,
          status: args.input.status ?? "todo",
          priority: args.input.priority ?? "medium",
          dueDate: args.input.dueDate ? new Date(args.input.dueDate) : null,
          sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
          assigneeId: args.input.assigneeId ?? null,
          projectId: args.input.projectId ?? null,
        },
        include: { assignee: true, project: true },
      });
    },
  }),
);

builder.mutationField("updateTask", (t2) =>
  t2.field({
    type: TaskType,
    args: {
      id: t2.arg.string({ required: true }),
      input: t2.arg({ type: UpdateTaskInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.userId) {
        throw new Error("Unauthorized");
      }
      return prisma.task.update({
        where: { id: args.id },
        data: {
          ...(args.input.title !== undefined &&
            args.input.title !== null && { title: args.input.title }),
          ...(args.input.description !== undefined && {
            description: args.input.description,
          }),
          ...(args.input.status !== undefined &&
            args.input.status !== null && { status: args.input.status }),
          ...(args.input.priority !== undefined &&
            args.input.priority !== null && {
              priority: args.input.priority,
            }),
          ...(args.input.dueDate !== undefined && {
            dueDate: args.input.dueDate ? new Date(args.input.dueDate) : null,
          }),
          ...(args.input.assigneeId !== undefined && {
            assigneeId: args.input.assigneeId,
          }),
          ...(args.input.projectId !== undefined && {
            projectId: args.input.projectId,
          }),
        },
        include: { assignee: true, project: true },
      });
    },
  }),
);

builder.mutationField("deleteTask", (t3) =>
  t3.field({
    type: "Boolean",
    args: { id: t3.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      if (!ctx.userId) {
        throw new Error("Unauthorized");
      }
      await prisma.task.delete({ where: { id: args.id } });
      return true;
    },
  }),
);

builder.mutationField("moveTask", (t4) =>
  t4.field({
    type: TaskType,
    args: {
      id: t4.arg.string({ required: true }),
      status: t4.arg.string({ required: true }),
      sortOrder: t4.arg.int({ required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.userId) {
        throw new Error("Unauthorized");
      }
      return prisma.task.update({
        where: { id: args.id },
        data: { status: args.status, sortOrder: args.sortOrder },
        include: { assignee: true, project: true },
      });
    },
  }),
);

builder.mutationField("createProject", (t5) =>
  t5.field({
    type: ProjectType,
    args: { name: t5.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      if (!ctx.userId) {
        throw new Error("Unauthorized");
      }
      return prisma.project.create({
        data: { name: args.name, ownerId: ctx.userId },
        include: {
          owner: true,
          tasks: { include: { assignee: true, project: true } },
        },
      });
    },
  }),
);
