"use client";

import { useState } from "react";

import { Button } from "@/components/atoms/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";

interface ProjectOption {
  id: string;
  name: string;
}

interface UserOption {
  id: string;
  name: string | null;
  email: string;
}

interface CreateTaskDialogProps {
  trigger?: React.ReactNode;
  onSave: (data: CreateTaskData) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  projects?: ProjectOption[];
  users?: UserOption[];
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: string;
  assigneeId: string;
}

export function CreateTaskDialog({
  trigger,
  onSave,
  open,
  onOpenChange,
  projects = [],
  users = [],
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("none");
  const [assigneeId, setAssigneeId] = useState("none");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({
        title,
        description,
        status,
        priority,
        dueDate,
        projectId: projectId === "none" ? "" : projectId,
        assigneeId: assigneeId === "none" ? "" : assigneeId,
      });
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setDueDate("");
      setProjectId("none");
      setAssigneeId("none");
      onOpenChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  const displayName = (user: UserOption) =>
    user.name ?? user.email.split("@")[0];

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              value={title}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              value={description}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select onValueChange={setStatus} value={status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select onValueChange={setPriority} value={priority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Project</Label>
              <Select onValueChange={setProjectId} value={projectId}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Assignee</Label>
              <Select onValueChange={setAssigneeId} value={assigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {displayName(u)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              value={dueDate}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading || !title} onClick={handleSave}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
