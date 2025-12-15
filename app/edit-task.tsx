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
import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function EditTaskScreen() {
     const router = useRouter();
     const {taskId} = useLocalSearchParams<{taskId: string}>();
     const {tasks, updateTask, deleteTask} = useTasks();
     const [task, setTask] = useState<Task | null>(null);
     const {currentTheme} = useTheme();
     const backgroundColor = Colors[currentTheme].background;
     const borderColor = Colors[currentTheme].border;
     const tintColor = Colors[currentTheme].tint;

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
          <SafeAreaView
               style={[styles.container, {backgroundColor}]}
               edges={["top"]}>
               {/* Fixed Header */}
               <View
                    style={[
                         styles.header,
                         {
                              backgroundColor: backgroundColor,
                              borderBottomColor: borderColor,
                         },
                    ]}>
                    <TouchableOpacity
                         onPress={() => router.back()}
                         style={styles.backButton}
                         activeOpacity={0.7}>
                         <View
                              style={[
                                   styles.backButtonIcon,
                                   {backgroundColor: tintColor + "20"},
                              ]}>
                              <IconSymbol
                                   name="chevron.left"
                                   size={18}
                                   color={tintColor}
                              />
                         </View>
                    </TouchableOpacity>
                    <View style={styles.titleSection}>
                         <ThemedText type="title" style={styles.title}>
                              Edit Task
                         </ThemedText>
                         <ThemedText
                              type="default"
                              style={[styles.subtitle, {opacity: 0.6}]}>
                              Update task details
                         </ThemedText>
                    </View>
                    <TouchableOpacity
                         onPress={handleDelete}
                         style={styles.deleteButton}
                         activeOpacity={0.7}>
                         <View
                              style={[
                                   styles.deleteButtonIcon,
                                   {backgroundColor: "#EF444420"},
                              ]}>
                              <IconSymbol
                                   name="trash"
                                   size={16}
                                   color="#EF4444"
                              />
                         </View>
                    </TouchableOpacity>
               </View>

               <TaskForm
                    initialData={task}
                    onSubmit={handleSubmit}
                    submitLabel="Save Changes"
               />
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
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
     },
     backButton: {
          marginRight: 12,
     },
     backButtonIcon: {
          width: 36,
          height: 36,
          borderRadius: 18,
          justifyContent: "center",
          alignItems: "center",
     },
     titleSection: {
          flex: 1,
     },
     title: {
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 2,
     },
     subtitle: {
          fontSize: 13,
     },
     deleteButton: {
          marginLeft: 8,
     },
     deleteButtonIcon: {
          width: 36,
          height: 36,
          borderRadius: 18,
          justifyContent: "center",
          alignItems: "center",
     },
});
