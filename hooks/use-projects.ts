import { useMutation, useQuery } from "@apollo/client/react";

import {
  CREATE_PROJECT,
  PROJECTS_QUERY,
} from "@/lib/graphql/operations/projects";

interface ProjectData {
  id: string;
  name: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsQueryData {
  projects: ProjectData[];
}

export function useProjects() {
  return useQuery<ProjectsQueryData>(PROJECTS_QUERY);
}

export function useCreateProject() {
  return useMutation(CREATE_PROJECT, {
    refetchQueries: [PROJECTS_QUERY],
  });
}
