/**
 * Task utility functions for filtering and sorting
 */

import {Task, TaskFilter, TaskPriority, TaskSort} from "@/types/task";
import {isOverdue} from "@/utils/date";

/**
 * Filter tasks based on filter type
 */
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
     switch (filter) {
          case TaskFilter.PENDING:
               return tasks.filter((task) => !task.completed);
          case TaskFilter.COMPLETED:
               return tasks.filter((task) => task.completed);
          case TaskFilter.OVERDUE:
               return tasks.filter(
                    (task) => !task.completed && isOverdue(task.dueDate)
               );
          case TaskFilter.ALL:
          default:
               return tasks;
     }
};

/**
 * Sort tasks based on sort type
 */
export const sortTasks = (tasks: Task[], sort: TaskSort): Task[] => {
     const sorted = [...tasks];

     switch (sort) {
          case TaskSort.DUE_DATE:
               return sorted.sort((a, b) => {
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return (
                         new Date(a.dueDate).getTime() -
                         new Date(b.dueDate).getTime()
                    );
               });

          case TaskSort.PRIORITY:
               const priorityOrder: Record<TaskPriority, number> = {
                    [TaskPriority.HIGH]: 3,
                    [TaskPriority.MEDIUM]: 2,
                    [TaskPriority.LOW]: 1,
               };
               return sorted.sort(
                    (a, b) =>
                         priorityOrder[b.priority] - priorityOrder[a.priority]
               );

          case TaskSort.CREATED_DATE:
               return sorted.sort(
                    (a, b) =>
                         new Date(b.createdAt).getTime() -
                         new Date(a.createdAt).getTime()
               );

          default:
               return sorted;
     }
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority: TaskPriority): string => {
     switch (priority) {
          case TaskPriority.HIGH:
               return "#EF4444"; // red
          case TaskPriority.MEDIUM:
               return "#F59E0B"; // amber
          case TaskPriority.LOW:
               return "#10B981"; // green
          default:
               return "#6B7280"; // gray
     }
};

/**
 * Get category color
 */
export const getCategoryColor = (category: string): string => {
     switch (category) {
          case "Work":
               return "#3B82F6"; // blue
          case "Personal":
               return "#8B5CF6"; // purple
          case "Study":
               return "#EC4899"; // pink
          default:
               return "#6B7280"; // gray
     }
};
