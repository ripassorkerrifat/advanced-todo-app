/**
 * Add Task Screen
 */

import {TaskForm} from "@/components/tasks/TaskForm";
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTasks} from "@/store/TaskContext";
import {useTheme} from "@/store/ThemeContext";
import {useRouter} from "expo-router";
import React from "react";
import {Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function AddTaskScreen() {
     const router = useRouter();
     const {addTask} = useTasks();
     const {currentTheme} = useTheme();
     const textColor = Colors[currentTheme].text;

     const handleSubmit = async (data: Parameters<typeof addTask>[0]) => {
          try {
               await addTask(data);
               router.back();
          } catch (error) {
               console.error("Error adding task:", error);
          }
     };

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
                              New Task
                         </ThemedText>
                         <View style={styles.placeholder} />
                    </View>

                    <TaskForm
                         onSubmit={handleSubmit}
                         submitLabel="Create Task"
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
     placeholder: {
          width: 40,
     },
});
