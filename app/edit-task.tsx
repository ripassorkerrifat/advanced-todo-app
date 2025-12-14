/**
 * Edit Task Screen
 */

import {TaskForm} from "@/components/tasks/TaskForm";
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTasks} from "@/store/TaskContext";
import {useTheme} from "@/store/ThemeContext";
import {Task} from "@/types/task";
import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {
     Alert,
     Platform,
     StyleSheet,
     TouchableOpacity,
     View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function EditTaskScreen() {
     const router = useRouter();
     const {taskId} = useLocalSearchParams<{taskId: string}>();
     const {tasks, updateTask, deleteTask} = useTasks();
     const [task, setTask] = useState<Task | null>(null);
     const {currentTheme} = useTheme();
     const textColor = Colors[currentTheme].text;

     useEffect(() => {
          if (taskId) {
               const foundTask = tasks.find((t) => t.id === taskId);
               if (foundTask) {
                    setTask(foundTask);
               } else {
                    Alert.alert("Error", "Task not found", [
                         {text: "OK", onPress: () => router.back()},
                    ]);
               }
          }
     }, [taskId, tasks, router]);

     const handleSubmit = async (data: Parameters<typeof updateTask>[1]) => {
          if (!taskId) return;

          try {
               await updateTask(taskId, data);
               router.back();
          } catch (error) {
               console.error("Error updating task:", error);
               Alert.alert("Error", "Failed to update task");
          }
     };

     const handleDelete = () => {
          if (!taskId) return;

          Alert.alert(
               "Delete Task",
               "Are you sure you want to delete this task?",
               [
                    {text: "Cancel", style: "cancel"},
                    {
                         text: "Delete",
                         style: "destructive",
                         onPress: async () => {
                              try {
                                   await deleteTask(taskId);
                                   router.back();
                              } catch (error) {
                                   console.error("Error deleting task:", error);
                                   Alert.alert(
                                        "Error",
                                        "Failed to delete task"
                                   );
                              }
                         },
                    },
               ]
          );
     };

     if (!task) {
          return (
               <SafeAreaView style={styles.container} edges={["top"]}>
                    <ThemedView style={styles.container}>
                         <ThemedText>Loading...</ThemedText>
                    </ThemedView>
               </SafeAreaView>
          );
     }

     return (
          <SafeAreaView style={styles.container} edges={["top"]}>
               <ThemedView style={styles.container}>
                    <View style={styles.header}>
                         <TouchableOpacity
                              onPress={() => router.back()}
                              style={styles.backButton}>
                              <IconSymbol
                                   name="chevron.left"
                                   size={24}
                                   color={textColor}
                              />
                         </TouchableOpacity>
                         <ThemedText type="title" style={styles.title}>
                              Edit Task
                         </ThemedText>
                         <TouchableOpacity
                              onPress={handleDelete}
                              style={styles.deleteButton}>
                              <IconSymbol
                                   name="trash"
                                   size={24}
                                   color="#EF4444"
                              />
                         </TouchableOpacity>
                    </View>

                    <TaskForm
                         initialData={task}
                         onSubmit={handleSubmit}
                         submitLabel="Save Changes"
                    />
               </ThemedView>
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "ios" ? 60 : 20,
          paddingBottom: 16,
     },
     backButton: {
          padding: 8,
     },
     title: {
          fontSize: 20,
          fontWeight: "700",
     },
     deleteButton: {
          padding: 8,
     },
});
