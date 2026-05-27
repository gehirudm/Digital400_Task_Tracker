import { builder } from "./builder";
import { ProjectType } from "./types/Project";
import { TaskType } from "./types/Task";
import { UserType } from "./types/User";

TaskType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    status: t.string({ resolve: (task) => task.status }),
    priority: t.string({ resolve: (task) => task.priority }),
    dueDate: t.field({
      type: "DateTime",
      nullable: true,
      resolve: (task) => task.dueDate as Date | null,
    }),
    sortOrder: t.exposeInt("sortOrder"),
    assignee: t.field({
      type: UserType,
      nullable: true,
      resolve: (task) => (task.assignee as typeof UserType.$inferType) ?? null,
    }),
    project: t.field({
      type: ProjectType,
      nullable: true,
      resolve: (task) =>
        (task.project as typeof ProjectType.$inferType) ?? null,
    }),
    createdAt: t.field({
      type: "DateTime",
      resolve: (task) => task.createdAt as Date,
    }),
    updatedAt: t.field({
      type: "DateTime",
      resolve: (task) => task.updatedAt as Date,
    }),
  }),
});

ProjectType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    owner: t.field({
      type: UserType,
      resolve: (project) =>
        (project.owner as typeof UserType.$inferType) ?? null,
    }),
    tasks: t.field({
      type: [TaskType],
      resolve: (project) =>
        (project.tasks as Array<typeof TaskType.$inferType>) ?? [],
    }),
    createdAt: t.field({
      type: "DateTime",
      resolve: (p) => p.createdAt as Date,
    }),
    updatedAt: t.field({
      type: "DateTime",
      resolve: (p) => p.updatedAt as Date,
    }),
  }),
});

import "./queries";
import "./mutations";

export const schema = builder.toSchema();
