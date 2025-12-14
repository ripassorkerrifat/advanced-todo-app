/**
 * Task Context API for global state management
 * Centralizes all task-related state and operations
 */

import * as storageService from "@/services/storage";
import {Task, TaskFilter, TaskSort} from "@/types/task";
import {filterTasks, sortTasks} from "@/utils/task";
import React, {
     createContext,
     useCallback,
     useContext,
     useEffect,
     useState,
} from "react";

interface TaskContextType {
     tasks: Task[];
     filteredAndSortedTasks: Task[];
     filter: TaskFilter;
     sort: TaskSort;
     isLoading: boolean;
     setFilter: (filter: TaskFilter) => void;
     setSort: (sort: TaskSort) => void;
     addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
     updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
     deleteTask: (taskId: string) => Promise<void>;
     toggleTaskComplete: (taskId: string) => Promise<void>;
     loadTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{children: React.ReactNode}> = ({
     children,
}) => {
     const [tasks, setTasks] = useState<Task[]>([]);
     const [filter, setFilter] = useState<TaskFilter>(TaskFilter.ALL);
     const [sort, setSort] = useState<TaskSort>(TaskSort.CREATED_DATE);
     const [isLoading, setIsLoading] = useState(true);

     // Load tasks on mount
     useEffect(() => {
          loadTasks();
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

     // Compute filtered and sorted tasks
     const filteredAndSortedTasks = React.useMemo(() => {
          const filtered = filterTasks(tasks, filter);
          return sortTasks(filtered, sort);
     }, [tasks, filter, sort]);

     const loadTasks = useCallback(async () => {
          try {
               setIsLoading(true);
               const loadedTasks = await storageService.loadTasks();
               setTasks(loadedTasks);
          } catch (error) {
               console.error("Error loading tasks:", error);
          } finally {
               setIsLoading(false);
          }
     }, []);

     const addTask = useCallback(
          async (taskData: Omit<Task, "id" | "createdAt">) => {
               const newTask: Task = {
                    ...taskData,
                    id: `task_${Date.now()}_${Math.random()
                         .toString(36)
                         .substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
               };

               try {
                    await storageService.addTask(newTask);
                    setTasks((prev) => [...prev, newTask]);
               } catch (error) {
                    console.error("Error adding task:", error);
                    throw error;
               }
          },
          []
     );

     const updateTask = useCallback(
          async (taskId: string, updates: Partial<Task>) => {
               try {
                    await storageService.updateTask(taskId, updates);
                    setTasks((prev) =>
                         prev.map((task) =>
                              task.id === taskId ? {...task, ...updates} : task
                         )
                    );
               } catch (error) {
                    console.error("Error updating task:", error);
                    throw error;
               }
          },
          []
     );

     const deleteTask = useCallback(async (taskId: string) => {
          try {
               await storageService.deleteTask(taskId);
               setTasks((prev) => prev.filter((task) => task.id !== taskId));
          } catch (error) {
               console.error("Error deleting task:", error);
               throw error;
          }
     }, []);

     const toggleTaskComplete = useCallback(
          async (taskId: string) => {
               const task = tasks.find((t) => t.id === taskId);
               if (!task) return;

               const updates: Partial<Task> = {
                    completed: !task.completed,
                    completedAt: !task.completed
                         ? new Date().toISOString()
                         : undefined,
               };

               await updateTask(taskId, updates);
          },
          [tasks, updateTask]
     );

     const value: TaskContextType = {
          tasks,
          filteredAndSortedTasks,
          filter,
          sort,
          isLoading,
          setFilter,
          setSort,
          addTask,
          updateTask,
          deleteTask,
          toggleTaskComplete,
          loadTasks,
     };

     return (
          <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
     );
};

export const useTasks = (): TaskContextType => {
     const context = useContext(TaskContext);
     if (context === undefined) {
          throw new Error("useTasks must be used within a TaskProvider");
     }
     return context;
};
