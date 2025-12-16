/**
 * Main Task List Screen with Shortcuts
 */

import {EmptyState} from "@/components/tasks/EmptyState";
import {TaskContextMenu} from "@/components/tasks/TaskContextMenu";
import {TaskItem} from "@/components/tasks/TaskItem";
import {UndoSnackbar} from "@/components/tasks/UndoSnackbar";
import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTasks} from "@/store/TaskContext";
import {useTheme} from "@/store/ThemeContext";
import {
     Task,
     TaskCategory,
     TaskFilter,
     TaskPriority,
     TaskSort,
} from "@/types/task";
import {useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import {
     FlatList,
     Modal,
     Platform,
     RefreshControl,
     ScrollView,
     StyleSheet,
     TextInput,
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
          searchQuery,
          searchCategory,
          searchPriority,
          isLoading,
          setFilter,
          setSort,
          setSearchQuery,
          setSearchCategory,
          setSearchPriority,
          toggleTaskComplete,
          deleteTask,
          loadTasks,
     } = useTasks();

     const [deletedTask, setDeletedTask] = useState<Task | null>(null);
     const [showUndo, setShowUndo] = useState(false);
     const [contextMenuTask, setContextMenuTask] = useState<Task | null>(null);
     const [showContextMenu, setShowContextMenu] = useState(false);
     const [batchMode, setBatchMode] = useState(false);
     const [showFilterSheet, setShowFilterSheet] = useState(false);
     const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

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

     const handleLongPress = useCallback((task: Task) => {
          setContextMenuTask(task);
          setShowContextMenu(true);
     }, []);

     const handleContextMenuEdit = useCallback(() => {
          if (contextMenuTask) {
               router.push({
                    pathname: "/edit-task",
                    params: {taskId: contextMenuTask.id},
               });
          }
     }, [contextMenuTask, router]);

     const handleContextMenuDelete = useCallback(() => {
          if (contextMenuTask) {
               handleDelete(contextMenuTask);
          }
     }, [contextMenuTask, handleDelete]);

     const handleContextMenuToggleComplete = useCallback(() => {
          if (contextMenuTask) {
               toggleTaskComplete(contextMenuTask.id);
          }
     }, [contextMenuTask, toggleTaskComplete]);

     const handleToggleBatchMode = useCallback(() => {
          setBatchMode((prev) => !prev);
          setSelectedTasks(new Set());
     }, []);

     const handleToggleTaskSelection = useCallback((taskId: string) => {
          setSelectedTasks((prev) => {
               const newSet = new Set(prev);
               if (newSet.has(taskId)) {
                    newSet.delete(taskId);
               } else {
                    newSet.add(taskId);
               }
               return newSet;
          });
     }, []);

     const handleBatchComplete = useCallback(async () => {
          for (const taskId of selectedTasks) {
               const task = tasks.find((t) => t.id === taskId);
               if (task && !task.completed) {
                    await toggleTaskComplete(taskId);
               }
          }
          setSelectedTasks(new Set());
          setBatchMode(false);
     }, [selectedTasks, tasks, toggleTaskComplete]);

     const handleBatchDelete = useCallback(async () => {
          for (const taskId of selectedTasks) {
               const task = tasks.find((t) => t.id === taskId);
               if (task) {
                    await handleDelete(task);
               }
          }
          setSelectedTasks(new Set());
          setBatchMode(false);
     }, [selectedTasks, tasks, handleDelete]);

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
               {/* Compact Stats Row */}
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
                              </View>
                         </TouchableOpacity>
                    ))}
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
                                   {tasks.length} tasks
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

               {/* Search Section */}
               <View
                    style={[
                         styles.searchSection,
                         {
                              backgroundColor: backgroundColor,
                              borderBottomColor: borderColor,
                         },
                    ]}>
                    <View
                         style={[
                              styles.searchBar,
                              {
                                   backgroundColor: cardColor,
                                   borderColor: borderColor,
                              },
                         ]}>
                         <IconSymbol
                              name="magnifyingglass"
                              size={18}
                              color={tintColor}
                         />
                         <TextInput
                              style={[
                                   styles.searchInput,
                                   {
                                        color: Colors[currentTheme].text,
                                   },
                              ]}
                              placeholder="Search tasks..."
                              placeholderTextColor={
                                   currentTheme === "dark"
                                        ? "#94A3B8"
                                        : "#9CA3AF"
                              }
                              value={searchQuery}
                              onChangeText={setSearchQuery}
                         />
                         {searchQuery.length > 0 && (
                              <TouchableOpacity
                                   onPress={() => setSearchQuery("")}
                                   activeOpacity={0.7}>
                                   <IconSymbol
                                        name="xmark.circle.fill"
                                        size={18}
                                        color={
                                             currentTheme === "dark"
                                                  ? "#94A3B8"
                                                  : "#9CA3AF"
                                        }
                                   />
                              </TouchableOpacity>
                         )}
                         <TouchableOpacity
                              onPress={() => setShowFilterSheet(true)}
                              activeOpacity={0.7}
                              style={styles.searchFilterButton}>
                              <IconSymbol
                                   name="arrow.up.arrow.down"
                                   size={18}
                                   color={tintColor}
                              />
                         </TouchableOpacity>
                    </View>

                    {(searchQuery.length > 0 ||
                         searchCategory ||
                         searchPriority) && (
                         <View style={styles.searchFilters}>
                              <ScrollView
                                   horizontal
                                   showsHorizontalScrollIndicator={false}
                                   contentContainerStyle={
                                        styles.searchFiltersRow
                                   }>
                                   <TouchableOpacity
                                        onPress={() =>
                                             setSearchCategory(undefined)
                                        }
                                        activeOpacity={0.7}
                                        style={[
                                             styles.searchFilterChip,
                                             {
                                                  backgroundColor:
                                                       searchCategory
                                                            ? tintColor
                                                            : "transparent",
                                                  borderColor: searchCategory
                                                       ? tintColor
                                                       : borderColor,
                                             },
                                        ]}>
                                        <ThemedText
                                             style={[
                                                  styles.searchFilterText,
                                                  {
                                                       color: searchCategory
                                                            ? "#FFFFFF"
                                                            : Colors[
                                                                   currentTheme
                                                              ].text,
                                                  },
                                             ]}>
                                             All Categories
                                        </ThemedText>
                                   </TouchableOpacity>
                                   {Object.values(TaskCategory).map((cat) => {
                                        const isActive = searchCategory === cat;
                                        return (
                                             <TouchableOpacity
                                                  key={cat}
                                                  onPress={() =>
                                                       setSearchCategory(
                                                            isActive
                                                                 ? undefined
                                                                 : cat
                                                       )
                                                  }
                                                  activeOpacity={0.7}
                                                  style={[
                                                       styles.searchFilterChip,
                                                       {
                                                            backgroundColor:
                                                                 isActive
                                                                      ? tintColor
                                                                      : "transparent",
                                                            borderColor:
                                                                 isActive
                                                                      ? tintColor
                                                                      : borderColor,
                                                       },
                                                  ]}>
                                                  {isActive && (
                                                       <IconSymbol
                                                            name="checkmark"
                                                            size={12}
                                                            color="#FFFFFF"
                                                            style={
                                                                 styles.checkIcon
                                                            }
                                                       />
                                                  )}
                                                  <ThemedText
                                                       style={[
                                                            styles.searchFilterText,
                                                            {
                                                                 color: isActive
                                                                      ? "#FFFFFF"
                                                                      : Colors[
                                                                             currentTheme
                                                                        ].text,
                                                            },
                                                       ]}>
                                                       {cat}
                                                  </ThemedText>
                                             </TouchableOpacity>
                                        );
                                   })}
                              </ScrollView>

                              <ScrollView
                                   horizontal
                                   showsHorizontalScrollIndicator={false}
                                   contentContainerStyle={
                                        styles.searchFiltersRow
                                   }>
                                   <TouchableOpacity
                                        onPress={() =>
                                             setSearchPriority(undefined)
                                        }
                                        activeOpacity={0.7}
                                        style={[
                                             styles.searchFilterChip,
                                             {
                                                  backgroundColor:
                                                       searchPriority
                                                            ? tintColor
                                                            : "transparent",
                                                  borderColor: searchPriority
                                                       ? tintColor
                                                       : borderColor,
                                             },
                                        ]}>
                                        <ThemedText
                                             style={[
                                                  styles.searchFilterText,
                                                  {
                                                       color: searchPriority
                                                            ? "#FFFFFF"
                                                            : Colors[
                                                                   currentTheme
                                                              ].text,
                                                  },
                                             ]}>
                                             All Priorities
                                        </ThemedText>
                                   </TouchableOpacity>
                                   {Object.values(TaskPriority).map((pri) => {
                                        const isActive = searchPriority === pri;
                                        return (
                                             <TouchableOpacity
                                                  key={pri}
                                                  onPress={() =>
                                                       setSearchPriority(
                                                            isActive
                                                                 ? undefined
                                                                 : pri
                                                       )
                                                  }
                                                  activeOpacity={0.7}
                                                  style={[
                                                       styles.searchFilterChip,
                                                       {
                                                            backgroundColor:
                                                                 isActive
                                                                      ? tintColor
                                                                      : "transparent",
                                                            borderColor:
                                                                 isActive
                                                                      ? tintColor
                                                                      : borderColor,
                                                       },
                                                  ]}>
                                                  {isActive && (
                                                       <IconSymbol
                                                            name="checkmark"
                                                            size={12}
                                                            color="#FFFFFF"
                                                            style={
                                                                 styles.checkIcon
                                                            }
                                                       />
                                                  )}
                                                  <ThemedText
                                                       style={[
                                                            styles.searchFilterText,
                                                            {
                                                                 color: isActive
                                                                      ? "#FFFFFF"
                                                                      : Colors[
                                                                             currentTheme
                                                                        ].text,
                                                            },
                                                       ]}>
                                                       {pri}
                                                  </ThemedText>
                                             </TouchableOpacity>
                                        );
                                   })}
                              </ScrollView>
                         </View>
                    )}
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
                                   onPress={
                                        batchMode
                                             ? () =>
                                                    handleToggleTaskSelection(
                                                         item.id
                                                    )
                                             : () => handleTaskPress(item)
                                   }
                                   onToggleComplete={() =>
                                        handleToggleComplete(item.id)
                                   }
                                   onDelete={() => handleDelete(item)}
                                   searchQuery={searchQuery}
                                   onLongPress={() => handleLongPress(item)}
                                   isSelected={selectedTasks.has(item.id)}
                                   onSelect={() =>
                                        handleToggleTaskSelection(item.id)
                                   }
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

               {/* Batch Mode Actions */}
               {batchMode && selectedTasks.size > 0 && (
                    <View
                         style={[
                              styles.batchActions,
                              {
                                   backgroundColor: cardColor,
                                   borderTopColor: borderColor,
                              },
                         ]}>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.batchCount}>
                              {selectedTasks.size} selected
                         </ThemedText>
                         <View style={styles.batchButtons}>
                              <TouchableOpacity
                                   onPress={handleBatchComplete}
                                   style={[
                                        styles.batchButton,
                                        {backgroundColor: "#10B981"},
                                   ]}
                                   activeOpacity={0.8}>
                                   <IconSymbol
                                        name="checkmark.circle.fill"
                                        size={14}
                                        color="#FFFFFF"
                                   />
                                   <ThemedText style={styles.batchButtonText}>
                                        Complete
                                   </ThemedText>
                              </TouchableOpacity>
                              <TouchableOpacity
                                   onPress={handleBatchDelete}
                                   style={[
                                        styles.batchButton,
                                        {backgroundColor: "#EF4444"},
                                   ]}
                                   activeOpacity={0.8}>
                                   <IconSymbol
                                        name="trash"
                                        size={14}
                                        color="#FFFFFF"
                                   />
                                   <ThemedText style={styles.batchButtonText}>
                                        Delete
                                   </ThemedText>
                              </TouchableOpacity>
                         </View>
                    </View>
               )}

               {/* Batch Mode Toggle Button - Only show when not in batch mode */}
               {!batchMode && displayTasks.length > 0 && (
                    <TouchableOpacity
                         onPress={handleToggleBatchMode}
                         style={[
                              styles.batchModeButton,
                              {
                                   backgroundColor: tintColor,
                                   shadowColor: tintColor,
                              },
                         ]}
                         activeOpacity={0.8}>
                         <IconSymbol
                              name="checkmark.circle.fill"
                              size={16}
                              color="#FFFFFF"
                         />
                         <ThemedText style={styles.batchModeButtonText}>
                              Select
                         </ThemedText>
                    </TouchableOpacity>
               )}

               {/* Cancel Button - Only show in batch mode when NO tasks selected (to avoid overlap with batch actions bar) */}
               {batchMode && selectedTasks.size === 0 && (
                    <TouchableOpacity
                         onPress={handleToggleBatchMode}
                         style={[
                              styles.batchModeButton,
                              styles.batchModeCancelButton,
                              {
                                   backgroundColor: cardColor,
                                   borderColor: borderColor,
                              },
                         ]}
                         activeOpacity={0.8}>
                         <IconSymbol
                              name="xmark.circle.fill"
                              size={16}
                              color={tintColor}
                         />
                         <ThemedText
                              style={[
                                   styles.batchModeButtonText,
                                   {color: tintColor},
                              ]}>
                              Cancel
                         </ThemedText>
                    </TouchableOpacity>
               )}

               {/* Context Menu */}
               <TaskContextMenu
                    visible={showContextMenu}
                    task={contextMenuTask}
                    onClose={() => {
                         setShowContextMenu(false);
                         setContextMenuTask(null);
                    }}
                    onEdit={handleContextMenuEdit}
                    onDelete={handleContextMenuDelete}
                    onToggleComplete={handleContextMenuToggleComplete}
               />

               {/* Undo Snackbar */}
               <UndoSnackbar
                    visible={showUndo}
                    onUndo={handleUndo}
                    onDismiss={handleDismissUndo}
                    message="Task deleted"
               />

               {/* Filter & Sort Bottom Sheet */}
               <Modal
                    visible={showFilterSheet}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowFilterSheet(false)}>
                    <View style={styles.sheetOverlay}>
                         <TouchableOpacity
                              style={styles.sheetBackdrop}
                              activeOpacity={1}
                              onPress={() => setShowFilterSheet(false)}
                         />
                         <View
                              style={[
                                   styles.sheetContainer,
                                   {
                                        backgroundColor: cardColor,
                                        borderTopColor: borderColor,
                                   },
                              ]}>
                              <View style={styles.sheetHandle} />
                              <View style={styles.sheetHeaderRow}>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.sheetTitle}>
                                        Filter & Sort
                                   </ThemedText>
                                   <TouchableOpacity
                                        onPress={() =>
                                             setShowFilterSheet(false)
                                        }>
                                        <IconSymbol
                                             name="xmark.circle.fill"
                                             size={20}
                                             color={Colors[currentTheme].text}
                                        />
                                   </TouchableOpacity>
                              </View>

                              <ScrollView
                                   showsVerticalScrollIndicator={false}
                                   contentContainerStyle={styles.sheetContent}>
                                   {/* Filter Section */}
                                   <View style={styles.sheetSection}>
                                        <View style={styles.sheetSectionHeader}>
                                             <IconSymbol
                                                  name="list.bullet"
                                                  size={16}
                                                  color={tintColor}
                                             />
                                             <ThemedText
                                                  type="defaultSemiBold"
                                                  style={
                                                       styles.sheetSectionTitle
                                                  }>
                                                  Filter Tasks
                                             </ThemedText>
                                        </View>
                                        <View style={styles.sheetChipRow}>
                                             {Object.values(TaskFilter).map(
                                                  (f) => {
                                                       const isActive =
                                                            filter === f;
                                                       return (
                                                            <TouchableOpacity
                                                                 key={f}
                                                                 onPress={() =>
                                                                      setFilter(
                                                                           f
                                                                      )
                                                                 }
                                                                 activeOpacity={
                                                                      0.7
                                                                 }
                                                                 style={[
                                                                      styles.sheetChip,
                                                                      {
                                                                           backgroundColor:
                                                                                isActive
                                                                                     ? tintColor
                                                                                     : "transparent",
                                                                           borderColor:
                                                                                isActive
                                                                                     ? tintColor
                                                                                     : borderColor,
                                                                      },
                                                                 ]}>
                                                                 {isActive && (
                                                                      <IconSymbol
                                                                           name="checkmark"
                                                                           size={
                                                                                12
                                                                           }
                                                                           color="#FFFFFF"
                                                                      />
                                                                 )}
                                                                 <ThemedText
                                                                      style={[
                                                                           styles.sheetChipText,
                                                                           {
                                                                                color: isActive
                                                                                     ? "#FFFFFF"
                                                                                     : Colors[
                                                                                            currentTheme
                                                                                       ]
                                                                                            .text,
                                                                           },
                                                                      ]}>
                                                                      {f}
                                                                 </ThemedText>
                                                            </TouchableOpacity>
                                                       );
                                                  }
                                             )}
                                        </View>
                                   </View>

                                   {/* Sort Section */}
                                   <View style={styles.sheetSection}>
                                        <View style={styles.sheetSectionHeader}>
                                             <IconSymbol
                                                  name="arrow.up.arrow.down"
                                                  size={16}
                                                  color={tintColor}
                                             />
                                             <ThemedText
                                                  type="defaultSemiBold"
                                                  style={
                                                       styles.sheetSectionTitle
                                                  }>
                                                  Sort By
                                             </ThemedText>
                                        </View>
                                        <View style={styles.sheetChipRow}>
                                             {Object.values(TaskSort).map(
                                                  (s) => {
                                                       const isActive =
                                                            sort === s;
                                                       return (
                                                            <TouchableOpacity
                                                                 key={s}
                                                                 onPress={() =>
                                                                      setSort(s)
                                                                 }
                                                                 activeOpacity={
                                                                      0.7
                                                                 }
                                                                 style={[
                                                                      styles.sheetChip,
                                                                      {
                                                                           backgroundColor:
                                                                                isActive
                                                                                     ? tintColor
                                                                                     : "transparent",
                                                                           borderColor:
                                                                                isActive
                                                                                     ? tintColor
                                                                                     : borderColor,
                                                                      },
                                                                 ]}>
                                                                 {isActive && (
                                                                      <IconSymbol
                                                                           name="checkmark"
                                                                           size={
                                                                                12
                                                                           }
                                                                           color="#FFFFFF"
                                                                      />
                                                                 )}
                                                                 <ThemedText
                                                                      style={[
                                                                           styles.sheetChipText,
                                                                           {
                                                                                color: isActive
                                                                                     ? "#FFFFFF"
                                                                                     : Colors[
                                                                                            currentTheme
                                                                                       ]
                                                                                            .text,
                                                                           },
                                                                      ]}>
                                                                      {s}
                                                                 </ThemedText>
                                                            </TouchableOpacity>
                                                       );
                                                  }
                                             )}
                                        </View>
                                   </View>
                              </ScrollView>
                         </View>
                    </View>
               </Modal>
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
     searchSection: {
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
     },
     searchBar: {
          flexDirection: "row",
          alignItems: "center",
          height: 44,
          borderRadius: 12,
          borderWidth: 1.5,
          paddingHorizontal: 14,
          gap: 10,
     },
     searchInput: {
          flex: 1,
          fontSize: 15,
          fontWeight: "500",
     },
     searchFilters: {
          marginTop: 12,
          gap: 8,
     },
     searchFiltersRow: {
          gap: 8,
          paddingRight: 20,
     },
     searchFilterButton: {
          marginLeft: 4,
          paddingHorizontal: 6,
          paddingVertical: 4,
          borderRadius: 10,
     },
     searchFilterChip: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          borderWidth: 1.5,
          minHeight: 30,
          gap: 6,
     },
     checkIcon: {
          marginRight: 2,
     },
     searchFilterText: {
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 0.2,
     },
     statsSection: {
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          gap: 8,
     },
     statBox: {
          flex: 1,
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 14,
          borderLeftWidth: 4,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          minHeight: 72,
          flexDirection: "column",
          justifyContent: "space-between",
     },
     statBoxContent: {
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 0,
     },
     statCircle: {
          width: 36,
          height: 36,
          borderRadius: 18,
          justifyContent: "center",
          alignItems: "center",
     },
     statCircleText: {
          fontSize: 16,
          fontWeight: "800",
          color: "#FFFFFF",
     },
     statBoxText: {
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0,
          paddingBottom: 0,
     },
     statBoxLabel: {
          fontSize: 12,
          fontWeight: "700",
          textAlign: "center",
     },
     statBoxSub: {
          fontSize: 10,
          fontWeight: "500",
          textAlign: "center",
     },
     controlsSection: {
          paddingVertical: 8,
          paddingHorizontal: 16,
          gap: 8,
     },
     filterContainer: {
          gap: 6,
     },
     sortContainer: {
          gap: 6,
     },
     filterHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginBottom: 2,
     },
     filterIconBadge: {
          width: 24,
          height: 24,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
     },
     filterSectionTitle: {
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.3,
     },
     filterChipsRow: {
          gap: 8,
          paddingRight: 8,
     },
     filterButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 14,
          borderWidth: 1.5,
          minHeight: 26,
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
     sheetOverlay: {
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.35)",
     },
     sheetBackdrop: {
          flex: 1,
     },
     sheetContainer: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 1,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
          maxHeight: "60%",
     },
     sheetHandle: {
          alignSelf: "center",
          width: 40,
          height: 4,
          borderRadius: 2,
          marginVertical: 6,
          backgroundColor: "rgba(148, 163, 184, 0.8)",
     },
     sheetHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
     },
     sheetTitle: {
          fontSize: 16,
          fontWeight: "700",
     },
     sheetContent: {
          paddingTop: 4,
          paddingBottom: 8,
          gap: 16,
     },
     sheetSection: {
          gap: 8,
     },
     sheetSectionHeader: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
     },
     sheetSectionTitle: {
          fontSize: 14,
          fontWeight: "700",
     },
     sheetChipRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
     },
     sheetChip: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 999,
          borderWidth: 1.5,
          gap: 6,
     },
     sheetChipText: {
          fontSize: 13,
          fontWeight: "600",
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
     batchActions: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: 20,
          borderTopWidth: 1,
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
     },
     batchCount: {
          fontSize: 14,
          fontWeight: "700",
     },
     batchButtons: {
          flexDirection: "row",
          gap: 8,
     },
     batchButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 10,
          gap: 5,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
     },
     batchButtonText: {
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: "700",
     },
     batchModeButton: {
          position: "absolute",
          bottom: 20,
          right: 20,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 20,
          gap: 6,
          shadowOffset: {width: 0, height: 3},
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 6,
     },
     batchModeCancelButton: {
          borderWidth: 1.5,
     },
     batchModeButtonText: {
          color: "#FFFFFF",
          fontSize: 13,
          fontWeight: "700",
     },
});
