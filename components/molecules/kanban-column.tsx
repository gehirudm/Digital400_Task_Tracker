import { Plus } from "lucide-react";

import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { ScrollArea } from "@/components/atoms/scroll-area";

import { SortableTaskCard } from "./sortable-task-card";

import type { TaskCardProps } from "./task-card";

type Task = Omit<TaskCardProps, "onEdit" | "onDelete" | "onPriorityChange"> & {
  id: string;
};

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
  onEditTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onPriorityChange?: (id: string, priority: string) => void;
}

export function KanbanColumn({
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onPriorityChange,
}: KanbanColumnProps) {
  return (
    <Card className="flex w-full shrink-0 flex-col md:w-72 md:snap-center lg:w-80">
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
        <ScrollArea className="h-[calc(100vh-18rem)]">
          {tasks.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              It&apos;s very empty in here
            </p>
          ) : (
            <div className="flex flex-col gap-2 p-1">
              {tasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  {...task}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onPriorityChange={onPriorityChange}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
