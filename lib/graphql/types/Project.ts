import { builder } from "../builder";

export const ProjectType = builder.objectRef<{
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: Record<string, unknown>;
  tasks?: Array<Record<string, unknown>>;
}>("Project");
