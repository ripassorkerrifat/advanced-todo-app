/**
 * Add Task Screen
 */

import {TaskForm} from "@/components/tasks/TaskForm";
import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTasks} from "@/store/TaskContext";
import {useTheme} from "@/store/ThemeContext";
import {useRouter} from "expo-router";
import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function AddTaskScreen() {
     const router = useRouter();
     const {addTask} = useTasks();
     const {currentTheme} = useTheme();
     const backgroundColor = Colors[currentTheme].background;
     const borderColor = Colors[currentTheme].border;
     const tintColor = Colors[currentTheme].tint;

     const handleSubmit = async (data: Parameters<typeof addTask>[0]) => {
          try {
               await addTask(data);
               router.back();
          } catch (error) {
               console.error("Error adding task:", error);
          }
     };

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
                              New Task
                         </ThemedText>
                         <ThemedText
                              type="default"
                              style={[styles.subtitle, {opacity: 0.6}]}>
                              Create a new task
                         </ThemedText>
                    </View>
                    <View style={styles.placeholder} />
               </View>

               <TaskForm onSubmit={handleSubmit} submitLabel="Create Task" />
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
     placeholder: {
          width: 36,
     },
});
