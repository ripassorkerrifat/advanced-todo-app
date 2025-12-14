/**
 * Main Task List Screen with Shortcuts
 */

import {EmptyState} from "@/components/tasks/EmptyState";
import {TaskItem} from "@/components/tasks/TaskItem";
import {UndoSnackbar} from "@/components/tasks/UndoSnackbar";
import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTasks} from "@/store/TaskContext";
import {useTheme} from "@/store/ThemeContext";
import {Task, TaskFilter, TaskSort} from "@/types/task";
import {useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import {
     FlatList,
     Platform,
     RefreshControl,
     ScrollView,
     StyleSheet,
     TouchableOpacity,
     View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function TaskListScreen() {
     const router = useRouter();
     const {currentTheme} = useTheme();
     const {
          filteredAndSortedTasks,
          tasks,
          filter,
          sort,
          isLoading,
          setFilter,
          setSort,
          toggleTaskComplete,
          deleteTask,
          loadTasks,
     } = useTasks();

     const [deletedTask, setDeletedTask] = useState<Task | null>(null);
     const [showUndo, setShowUndo] = useState(false);

     const handleDelete = useCallback(async (task: Task) => {
          setDeletedTask(task);
          setShowUndo(true);
     }, []);

     const handleUndo = useCallback(() => {
          setDeletedTask(null);
          setShowUndo(false);
     }, []);

     const handleDismissUndo = useCallback(async () => {
          if (deletedTask) {
               await deleteTask(deletedTask.id);
               setDeletedTask(null);
          }
          setShowUndo(false);
     }, [deletedTask, deleteTask]);

     const handleTaskPress = useCallback(
          (task: Task) => {
               router.push({
                    pathname: "/edit-task",
                    params: {taskId: task.id},
               });
          },
          [router]
     );

     const handleToggleComplete = useCallback(
          async (taskId: string) => {
               await toggleTaskComplete(taskId);
          },
          [toggleTaskComplete]
     );

     const displayTasks =
          showUndo && deletedTask
               ? filteredAndSortedTasks.filter((t) => t.id !== deletedTask.id)
               : filteredAndSortedTasks;

     const backgroundColor =
          currentTheme === "dark"
               ? Colors.dark.background
               : Colors.light.background;
     const cardColor =
          currentTheme === "dark" ? Colors.dark.card : Colors.light.card;
     const tintColor = Colors[currentTheme].primary;
     const borderColor =
          currentTheme === "dark" ? Colors.dark.border : Colors.light.border;

     const pendingCount = tasks.filter((t) => !t.completed).length;
     const completedCount = tasks.filter((t) => t.completed).length;
     const overdueCount = tasks.filter(
          (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
     ).length;

     const shortcuts = [
          {
               id: "pending",
               label: "Pending",
               count: pendingCount,
               color: "#F59E0B",
               onPress: () => setFilter(TaskFilter.PENDING),
          },
          {
               id: "completed",
               label: "Done",
               count: completedCount,
               color: "#10B981",
               onPress: () => setFilter(TaskFilter.COMPLETED),
          },
          {
               id: "overdue",
               label: "Overdue",
               count: overdueCount,
               color: "#EF4444",
               onPress: () => setFilter(TaskFilter.ALL),
          },
     ];

     const ListHeaderComponent = () => (
          <>
               {/* Stats Section - Redesigned */}
               <View style={styles.statsSection}>
                    {shortcuts.map((shortcut) => (
                         <TouchableOpacity
                              key={shortcut.id}
                              onPress={shortcut.onPress}
                              activeOpacity={0.8}
                              style={[
                                   styles.statBox,
                                   {
                                        backgroundColor: cardColor,
                                        borderLeftColor: shortcut.color,
                                   },
                              ]}>
                              <View style={styles.statBoxContent}>
                                   <View
                                        style={[
                                             styles.statCircle,
                                             {backgroundColor: shortcut.color},
                                        ]}>
                                        <ThemedText
                                             type="defaultSemiBold"
                                             style={styles.statCircleText}>
                                             {shortcut.count}
                                        </ThemedText>
                                   </View>
                              </View>
                              <View style={styles.statBoxText}>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.statBoxLabel}>
                                        {shortcut.label}
                                   </ThemedText>
                                   <ThemedText
                                        type="default"
                                        style={[
                                             styles.statBoxSub,
                                             {opacity: 0.6},
                                        ]}>
                                        tasks
                                   </ThemedText>
                              </View>
                         </TouchableOpacity>
                    ))}
               </View>

               {/* Modern Filter & Sort Section */}
               <View
                    style={[
                         styles.controlsSection,
                         {
                              backgroundColor: backgroundColor,
                         },
                    ]}>
                    {/* Filter Section */}
                    <View style={styles.filterContainer}>
                         <View style={styles.filterHeaderRow}>
                              <View
                                   style={[
                                        styles.filterIconBadge,
                                        {backgroundColor: tintColor + "20"},
                                   ]}>
                                   <IconSymbol
                                        name="list.bullet"
                                        size={16}
                                        color={tintColor}
                                   />
                              </View>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={styles.filterSectionTitle}>
                                   Filter Tasks
                              </ThemedText>
                         </View>
                         <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={styles.filterChipsRow}>
                              {Object.values(TaskFilter).map((f) => {
                                   const isActive = filter === f;
                                   return (
                                        <TouchableOpacity
                                             key={f}
                                             onPress={() => setFilter(f)}
                                             activeOpacity={0.7}
                                             style={[
                                                  styles.filterButton,
                                                  {
                                                       backgroundColor: isActive
                                                            ? tintColor
                                                            : "transparent",
                                                       borderColor: isActive
                                                            ? tintColor
                                                            : borderColor,
                                                  },
                                             ]}>
                                             {isActive && (
                                                  <IconSymbol
                                                       name="checkmark"
                                                       size={14}
                                                       color="#FFFFFF"
                                                  />
                                             )}
                                             <ThemedText
                                                  style={[
                                                       styles.filterButtonText,
                                                       {
                                                            color: isActive
                                                                 ? "#FFFFFF"
                                                                 : Colors[
                                                                        currentTheme
                                                                   ].text,
                                                       },
                                                  ]}>
                                                  {f}
                                             </ThemedText>
                                        </TouchableOpacity>
                                   );
                              })}
                         </ScrollView>
                    </View>

                    {/* Sort Section */}
                    <View style={styles.sortContainer}>
                         <View style={styles.filterHeaderRow}>
                              <View
                                   style={[
                                        styles.filterIconBadge,
                                        {backgroundColor: tintColor + "20"},
                                   ]}>
                                   <IconSymbol
                                        name="calendar"
                                        size={16}
                                        color={tintColor}
                                   />
                              </View>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={styles.filterSectionTitle}>
                                   Sort By
                              </ThemedText>
                         </View>
                         <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={styles.filterChipsRow}>
                              {Object.values(TaskSort).map((s) => {
                                   const isActive = sort === s;
                                   return (
                                        <TouchableOpacity
                                             key={s}
                                             onPress={() => setSort(s)}
                                             activeOpacity={0.7}
                                             style={[
                                                  styles.sortButton,
                                                  {
                                                       backgroundColor: isActive
                                                            ? tintColor
                                                            : "transparent",
                                                       borderColor: isActive
                                                            ? tintColor
                                                            : borderColor,
                                                  },
                                             ]}>
                                             {isActive && (
                                                  <IconSymbol
                                                       name="checkmark"
                                                       size={13}
                                                       color="#FFFFFF"
                                                  />
                                             )}
                                             <ThemedText
                                                  style={[
                                                       styles.sortButtonText,
                                                       {
                                                            color: isActive
                                                                 ? "#FFFFFF"
                                                                 : Colors[
                                                                        currentTheme
                                                                   ].text,
                                                       },
                                                  ]}>
                                                  {s}
                                             </ThemedText>
                                        </TouchableOpacity>
                                   );
                              })}
                         </ScrollView>
                    </View>
               </View>
          </>
     );

     return (
          <SafeAreaView
               style={[styles.container, {backgroundColor}]}
               edges={["top"]}>
               {/* Fixed Header */}
               <View
                    style={[
                         styles.fixedHeader,
                         {
                              backgroundColor: backgroundColor,
                              borderBottomColor: borderColor,
                         },
                    ]}>
                    <View style={styles.fixedHeaderContent}>
                         <View>
                              <ThemedText
                                   type="title"
                                   style={styles.fixedTitle}>
                                   My Tasks
                              </ThemedText>
                              <ThemedText
                                   type="default"
                                   style={[
                                        styles.fixedSubtitle,
                                        {opacity: 0.6},
                                   ]}>
                                   {tasks.length} total
                              </ThemedText>
                         </View>
                         <TouchableOpacity
                              onPress={() => router.push("/add-task")}
                              style={[
                                   styles.fixedAddButton,
                                   {
                                        backgroundColor: tintColor,
                                        shadowColor: tintColor,
                                   },
                              ]}
                              activeOpacity={0.8}>
                              <IconSymbol
                                   name="plus"
                                   size={22}
                                   color="#FFFFFF"
                              />
                         </TouchableOpacity>
                    </View>
               </View>

               {/* Scrollable Content */}
               {isLoading ? (
                    <View style={styles.center}>
                         <ThemedText>Loading...</ThemedText>
                    </View>
               ) : displayTasks.length === 0 ? (
                    <>
                         <ListHeaderComponent />
                         <EmptyState
                              message={
                                   filter === TaskFilter.COMPLETED
                                        ? "No completed tasks"
                                        : filter === TaskFilter.PENDING
                                        ? "No pending tasks"
                                        : "No tasks yet. Create your first task!"
                              }
                              icon={
                                   filter === TaskFilter.COMPLETED
                                        ? "checkmark.circle"
                                        : "list.bullet"
                              }
                         />
                    </>
               ) : (
                    <FlatList
                         data={displayTasks}
                         keyExtractor={(item) => item.id}
                         renderItem={({item}) => (
                              <TaskItem
                                   task={item}
                                   onPress={() => handleTaskPress(item)}
                                   onToggleComplete={() =>
                                        handleToggleComplete(item.id)
                                   }
                                   onDelete={() => handleDelete(item)}
                              />
                         )}
                         ListHeaderComponent={ListHeaderComponent}
                         style={styles.list}
                         contentContainerStyle={styles.listContent}
                         refreshControl={
                              <RefreshControl
                                   refreshing={isLoading}
                                   onRefresh={loadTasks}
                                   tintColor={tintColor}
                              />
                         }
                         showsVerticalScrollIndicator={true}
                         nestedScrollEnabled={true}
                         scrollEnabled={true}
                         bounces={true}
                         removeClippedSubviews={false}
                    />
               )}

               {/* Undo Snackbar */}
               <UndoSnackbar
                    visible={showUndo}
                    onUndo={handleUndo}
                    onDismiss={handleDismissUndo}
                    message="Task deleted"
               />
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     fixedHeader: {
          paddingTop: Platform.OS === "ios" ? 8 : 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          zIndex: 10,
     },
     fixedHeaderContent: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
     },
     fixedTitle: {
          fontSize: 32,
          fontWeight: "800",
          marginBottom: 4,
          letterSpacing: -0.5,
     },
     fixedSubtitle: {
          fontSize: 14,
          fontWeight: "500",
     },
     fixedAddButton: {
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
          shadowOffset: {width: 0, height: 3},
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 6,
     },
     statsSection: {
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 16,
          gap: 10,
     },
     statBox: {
          flex: 1,
          padding: 14,
          borderRadius: 16,
          borderLeftWidth: 4,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          minHeight: 100,
          flexDirection: "column",
          justifyContent: "space-between",
     },
     statBoxContent: {
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 2,
     },
     statCircle: {
          width: 48,
          height: 48,
          borderRadius: 24,
          justifyContent: "center",
          alignItems: "center",
     },
     statCircleText: {
          fontSize: 20,
          fontWeight: "800",
          color: "#FFFFFF",
     },
     statBoxText: {
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          paddingBottom: 2,
     },
     statBoxLabel: {
          fontSize: 14,
          fontWeight: "700",
          textAlign: "center",
     },
     statBoxSub: {
          fontSize: 11,
          fontWeight: "400",
          textAlign: "center",
     },
     controlsSection: {
          paddingVertical: 16,
          paddingHorizontal: 20,
          gap: 16,
     },
     filterContainer: {
          gap: 12,
     },
     sortContainer: {
          gap: 12,
     },
     filterHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
     },
     filterIconBadge: {
          width: 28,
          height: 28,
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
     },
     filterSectionTitle: {
          fontSize: 13,
          fontWeight: "700",
          letterSpacing: 0.3,
     },
     filterChipsRow: {
          gap: 10,
          paddingRight: 20,
     },
     filterButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 7,
          borderRadius: 18,
          borderWidth: 1.5,
          minHeight: 32,
          gap: 6,
     },
     filterButtonText: {
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 0.2,
     },
     sortButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          borderWidth: 1.5,
          minHeight: 30,
          gap: 6,
     },
     sortButtonText: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.2,
     },
     list: {
          flex: 1,
     },
     listContent: {
          paddingBottom: 100,
          paddingHorizontal: 0,
     },
     center: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
});
