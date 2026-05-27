"use client";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";

import { KanbanColumn } from "@/components/molecules/kanban-column";
import { TaskCard } from "@/components/molecules/task-card";

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

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
] as const;

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (id: string, status: string, sortOrder: number) => void;
  onAddTask: (status: string) => void;
  onEditTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanBoard({
  tasks,
  onMoveTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === taskId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    let newStatus: string;
    if (overTask) {
      newStatus = overTask.status;
    } else {
      newStatus = overId;
    }

    const tasksInColumn = tasks.filter((t) => t.status === newStatus).length;
    onMoveTask(taskId, newStatus, tasksInColumn);
  };

  const getColumnTasks = (status: string) =>
    tasks.filter((t) => t.status === status);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div className="flex h-full gap-4 overflow-x-auto p-4 snap-x snap-mandatory">
        {columns.map((column) => (
          <SortableContext
            key={column.id}
            items={getColumnTasks(column.id).map((t) => t.id)}
          >
            <KanbanColumn
              onAddTask={() => onAddTask(column.id)}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              tasks={getColumnTasks(column.id)}
              title={column.title}
            />
          </SortableContext>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="w-[85vw] opacity-90 sm:w-72 md:w-80">
            <TaskCard {...activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
