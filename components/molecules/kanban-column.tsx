import { Plus } from "lucide-react";

import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { ScrollArea } from "@/components/atoms/scroll-area";

import { TaskCard } from "./task-card";

interface Task {
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
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
  onEditTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

export function KanbanColumn({
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  return (
    <Card className="flex w-[85vw] shrink-0 snap-center flex-col sm:w-72 md:w-80">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-semibold">
          {title}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {tasks.length}
          </span>
        </CardTitle>
        <Button
          className="h-7 w-7"
          onClick={onAddTask}
          size="icon"
          variant="ghost"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="flex flex-col gap-2 p-1">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
