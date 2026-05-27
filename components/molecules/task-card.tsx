import { MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

const statusColors: Record<string, string> = {
  todo: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  done: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const nextPriority: Record<string, string> = {
  low: "medium",
  medium: "high",
  high: "low",
};

export interface TaskCardProps {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assignee: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  } | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPriorityChange?: (id: string, priority: string) => void;
  project?: {
    id: string;
    name: string;
  } | null;
}

export function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  assignee,
  project,
  onEdit,
  onDelete,
  onPriorityChange,
}: TaskCardProps) {
  return (
    <Card className="group cursor-pointer select-none transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge className={statusColors[status] ?? ""}>
            {status.replace("_", " ")}
          </Badge>
          <Badge
            className={`cursor-pointer ${priorityColors[priority] ?? ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onPriorityChange?.(id, nextPriority[priority] ?? "medium");
            }}
            variant="outline"
          >
            {priority}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="-mr-2 h-8 w-8 opacity-0 group-hover:opacity-100"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete?.(id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {assignee && (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={assignee.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-[10px]">
                    {assignee.name?.charAt(0) ?? assignee.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {assignee.name ?? assignee.email}
                </span>
              </div>
            )}
            {project && (
              <Badge className="text-[10px]" variant="secondary">
                {project.name}
              </Badge>
            )}
          </div>
          {dueDate && (
            <span className="text-xs text-muted-foreground">
              {new Date(dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
