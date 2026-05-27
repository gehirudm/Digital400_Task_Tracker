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
  return useMutation<{ createProject: ProjectData }, { name: string }>(
    CREATE_PROJECT,
    {
      update(cache, { data }) {
        const created = data?.createProject;
        if (!created) return;

        const existing = cache.readQuery<ProjectsQueryData>({
          query: PROJECTS_QUERY,
        });
        if (!existing) return;

        cache.writeQuery<ProjectsQueryData>({
          query: PROJECTS_QUERY,
          data: { projects: [created, ...existing.projects] },
        });
      },
    },
  );
}
