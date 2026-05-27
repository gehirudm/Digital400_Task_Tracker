"use client";

import { FolderOpen, Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Separator } from "@/components/atoms/separator";
import { Skeleton } from "@/components/atoms/skeleton";
import { useCreateProject, useProjects } from "@/hooks/use-projects";

export default function ProjectsPage() {
  const { data, loading } = useProjects();
  const [createProject, { loading: creating }] = useCreateProject();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createProject({ variables: { name: name.trim() } });
    setName("");
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
        <Separator />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const projects = data?.projects ?? [];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Organize your tasks into projects.
          </p>
        </div>
        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleCreate();
                }}
                placeholder="My Project"
                value={name}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={creating || !name.trim()}
                onClick={handleCreate}
              >
                {creating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Separator className="my-6" />
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FolderOpen className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first project to start organizing tasks.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              key={project.id}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  {project.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">
                    {project.tasks.length}{" "}
                    {project.tasks.length === 1 ? "task" : "tasks"}
                  </Badge>
                  {project.tasks.filter((t) => t.status === "done").length >
                    0 && (
                    <Badge variant="secondary">
                      {project.tasks.filter((t) => t.status === "done").length}{" "}
                      done
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
