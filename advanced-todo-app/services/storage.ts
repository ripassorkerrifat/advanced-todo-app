/**
 * AsyncStorage service layer for task persistence
 * Handles all CRUD operations for tasks
 */

import {Task} from "@/types/task";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@todo_app:tasks";

/**
 * Load all tasks from storage
 */
export const loadTasks = async (): Promise<Task[]> => {
     try {
          const data = await AsyncStorage.getItem(STORAGE_KEY);
          if (data) {
               return JSON.parse(data) as Task[];
          }
          return [];
     } catch (error) {
          console.error("Error loading tasks:", error);
          return [];
     }
};

/**
 * Save all tasks to storage
 */
export const saveTasks = async (tasks: Task[]): Promise<void> => {
     try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
     } catch (error) {
          console.error("Error saving tasks:", error);
          throw error;
     }
};

/**
 * Add a new task
 */
export const addTask = async (task: Task): Promise<void> => {
     const tasks = await loadTasks();
     tasks.push(task);
     await saveTasks(tasks);
};

/**
 * Update an existing task
 */
export const updateTask = async (
     taskId: string,
     updates: Partial<Task>
): Promise<void> => {
     const tasks = await loadTasks();
     const index = tasks.findIndex((t) => t.id === taskId);
     if (index !== -1) {
          tasks[index] = {...tasks[index], ...updates};
          await saveTasks(tasks);
     }
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<void> => {
     const tasks = await loadTasks();
     const filtered = tasks.filter((t) => t.id !== taskId);
     await saveTasks(filtered);
};

/**
 * Clear all tasks (for testing/reset)
 */
export const clearAllTasks = async (): Promise<void> => {
     await AsyncStorage.removeItem(STORAGE_KEY);
};
