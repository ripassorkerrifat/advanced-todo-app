/**
 * Task-related types and enums
 */

export enum TaskCategory {
     WORK = "Work",
     PERSONAL = "Personal",
     STUDY = "Study",
}

export enum TaskPriority {
     LOW = "Low",
     MEDIUM = "Medium",
     HIGH = "High",
}

export enum TaskFilter {
     ALL = "All",
     PENDING = "Pending",
     COMPLETED = "Completed",
     OVERDUE = "Overdue",
}

export enum TaskSort {
     CREATED_DATE = "Created Date",
     PRIORITY = "Priority",
     DUE_DATE = "Due Date",
}

export interface Task {
     id: string;
     title: string;
     description?: string;
     category: TaskCategory;
     priority: TaskPriority;
     dueDate?: string; // ISO date string
     completed: boolean;
     createdAt: string; // ISO date string
     completedAt?: string; // ISO date string
}

export type TaskFormData = Omit<Task, "id" | "createdAt" | "completedAt">;
