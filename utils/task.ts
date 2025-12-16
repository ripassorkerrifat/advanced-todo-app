/**
 * Task utility functions for filtering and sorting
 */

import {
     Task,
     TaskCategory,
     TaskFilter,
     TaskPriority,
     TaskSort,
} from "@/types/task";
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

/**
 * Search tasks by query string
 */
export const searchTasks = (
     tasks: Task[],
     query: string,
     category?: TaskCategory,
     priority?: TaskPriority
): Task[] => {
     if (!query.trim() && !category && !priority) {
          return tasks;
     }

     const lowerQuery = query.toLowerCase().trim();

     return tasks.filter((task) => {
          // Text search
          const matchesText =
               !lowerQuery ||
               task.title.toLowerCase().includes(lowerQuery) ||
               task.description?.toLowerCase().includes(lowerQuery) ||
               task.notes?.toLowerCase().includes(lowerQuery);

          // Category filter
          const matchesCategory = !category || task.category === category;

          // Priority filter
          const matchesPriority = !priority || task.priority === priority;

          return matchesText && matchesCategory && matchesPriority;
     });
};

/**
 * Highlight matching text in a string
 */
export const highlightText = (
     text: string,
     query: string
): {text: string; highlight: boolean}[] => {
     if (!query.trim()) {
          return [{text, highlight: false}];
     }

     const lowerText = text.toLowerCase();
     const lowerQuery = query.toLowerCase();
     const parts: {text: string; highlight: boolean}[] = [];
     let lastIndex = 0;
     let index = lowerText.indexOf(lowerQuery, lastIndex);

     while (index !== -1) {
          if (index > lastIndex) {
               parts.push({
                    text: text.substring(lastIndex, index),
                    highlight: false,
               });
          }
          parts.push({
               text: text.substring(index, index + query.length),
               highlight: true,
          });
          lastIndex = index + query.length;
          index = lowerText.indexOf(lowerQuery, lastIndex);
     }

     if (lastIndex < text.length) {
          parts.push({text: text.substring(lastIndex), highlight: false});
     }

     return parts.length > 0 ? parts : [{text, highlight: false}];
};
