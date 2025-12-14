/**
 * Date utility functions
 */

/**
 * Check if a task is overdue
 */
export const isOverdue = (dueDate?: string): boolean => {
     if (!dueDate) return false;
     const due = new Date(dueDate);
     const now = new Date();
     now.setHours(0, 0, 0, 0);
     due.setHours(0, 0, 0, 0);
     return due < now;
};

/**
 * Format date for display
 */
export const formatDate = (dateString?: string): string => {
     if (!dateString) return "";
     const date = new Date(dateString);
     return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
     });
};

/**
 * Get ISO date string for today
 */
export const getTodayISO = (): string => {
     return new Date().toISOString();
};
