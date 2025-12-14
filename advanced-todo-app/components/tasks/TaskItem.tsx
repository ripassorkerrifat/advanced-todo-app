/**
 * Task item component with swipe-to-delete functionality
 */

import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";
import {Task} from "@/types/task";
import {formatDate, isOverdue} from "@/utils/date";
import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Reanimated, {
     runOnJS,
     useAnimatedStyle,
     useSharedValue,
     withSpring,
} from "react-native-reanimated";
import {CategoryIndicator} from "./CategoryIndicator";
import {PriorityBadge} from "./PriorityBadge";

interface TaskItemProps {
     task: Task;
     onPress: () => void;
     onToggleComplete: () => void;
     onDelete: () => void;
}

const SWIPE_THRESHOLD = -100;

export const TaskItem: React.FC<TaskItemProps> = ({
     task,
     onPress,
     onToggleComplete,
     onDelete,
}) => {
     const {currentTheme} = useTheme();
     const isDark = currentTheme === "dark";
     const translateX = useSharedValue(0);
     const [isDeleting, setIsDeleting] = useState(false);

     const overdue = isOverdue(task.dueDate);
     const backgroundColor = isDark
          ? Colors.dark.card
          : Colors.light.background;
     const textColor = isDark ? Colors.dark.text : Colors.light.text;
     const borderColor = isDark ? Colors.dark.border : Colors.light.border;

     const panGesture = Gesture.Pan()
          .activeOffsetX([-10, 10]) // Only activate on horizontal movement
          .failOffsetY([-10, 10]) // Fail if vertical movement is detected first
          .onUpdate((e) => {
               // Only allow swipe if horizontal movement is greater than vertical
               if (
                    Math.abs(e.translationX) > Math.abs(e.translationY) &&
                    e.translationX < 0
               ) {
                    translateX.value = e.translationX;
               }
          })
          .onEnd((e) => {
               if (e.translationX < SWIPE_THRESHOLD) {
                    translateX.value = withSpring(-200, {}, () => {
                         runOnJS(setIsDeleting)(true);
                         runOnJS(onDelete)();
                    });
               } else {
                    translateX.value = withSpring(0);
               }
          });

     const animatedStyle = useAnimatedStyle(() => {
          return {
               transform: [{translateX: translateX.value}],
          };
     });

     const deleteButtonStyle = useAnimatedStyle(() => {
          const opacity = translateX.value < -50 ? 1 : 0;
          return {
               opacity: withSpring(opacity),
          };
     });

     if (isDeleting) {
          return null;
     }

     return (
          <View style={styles.container}>
               <Reanimated.View
                    style={[styles.deleteButton, deleteButtonStyle]}>
                    <IconSymbol name="trash.fill" size={24} color="#FFFFFF" />
               </Reanimated.View>

               <GestureDetector gesture={panGesture}>
                    <Reanimated.View
                         style={[styles.taskContainer, animatedStyle]}>
                         <CategoryIndicator category={task.category} />

                         <TouchableOpacity
                              style={[
                                   styles.content,
                                   {
                                        backgroundColor,
                                        borderBottomColor: borderColor,
                                   },
                                   task.completed && styles.completed,
                              ]}
                              onPress={onPress}
                              activeOpacity={0.7}>
                              <View style={styles.header}>
                                   <TouchableOpacity
                                        onPress={onToggleComplete}
                                        style={styles.checkboxContainer}
                                        hitSlop={{
                                             top: 10,
                                             bottom: 10,
                                             left: 10,
                                             right: 10,
                                        }}>
                                        <View
                                             style={[
                                                  styles.checkbox,
                                                  {
                                                       borderColor:
                                                            task.completed
                                                                 ? "#10B981"
                                                                 : borderColor,
                                                       backgroundColor:
                                                            task.completed
                                                                 ? "#10B981"
                                                                 : "transparent",
                                                  },
                                             ]}>
                                             {task.completed && (
                                                  <IconSymbol
                                                       name="checkmark"
                                                       size={16}
                                                       color="#FFFFFF"
                                                  />
                                             )}
                                        </View>
                                   </TouchableOpacity>

                                   <View style={styles.titleContainer}>
                                        <Text
                                             style={[
                                                  styles.title,
                                                  {color: textColor},
                                                  task.completed &&
                                                       styles.completedText,
                                             ]}
                                             numberOfLines={1}>
                                             {task.title}
                                        </Text>
                                        {task.description && (
                                             <Text
                                                  style={[
                                                       styles.description,
                                                       {
                                                            color: textColor,
                                                            opacity: 0.6,
                                                       },
                                                  ]}
                                                  numberOfLines={2}>
                                                  {task.description}
                                             </Text>
                                        )}
                                   </View>
                              </View>

                              <View style={styles.footer}>
                                   <View style={styles.meta}>
                                        <PriorityBadge
                                             priority={task.priority}
                                        />
                                        {task.dueDate && (
                                             <View style={styles.dateContainer}>
                                                  <IconSymbol
                                                       name="calendar"
                                                       size={14}
                                                       color={
                                                            overdue
                                                                 ? "#EF4444"
                                                                 : textColor
                                                       }
                                                  />
                                                  <Text
                                                       style={[
                                                            styles.date,
                                                            {
                                                                 color: overdue
                                                                      ? "#EF4444"
                                                                      : textColor,
                                                            },
                                                            overdue &&
                                                                 styles.overdue,
                                                       ]}>
                                                       {formatDate(
                                                            task.dueDate
                                                       )}
                                                  </Text>
                                             </View>
                                        )}
                                   </View>
                              </View>
                         </TouchableOpacity>
                    </Reanimated.View>
               </GestureDetector>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          position: "relative",
          marginBottom: 1,
     },
     taskContainer: {
          flexDirection: "row",
     },
     deleteButton: {
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: "#EF4444",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 0,
     },
     content: {
          flex: 1,
          flexDirection: "row",
          padding: 16,
          borderBottomWidth: 1,
          minHeight: 80,
     },
     completed: {
          opacity: 0.6,
     },
     header: {
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
     },
     checkboxContainer: {
          marginRight: 12,
          marginTop: 2,
     },
     checkbox: {
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          justifyContent: "center",
          alignItems: "center",
     },
     titleContainer: {
          flex: 1,
     },
     title: {
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 4,
     },
     description: {
          fontSize: 14,
          lineHeight: 20,
     },
     completedText: {
          textDecorationLine: "line-through",
     },
     footer: {
          marginTop: 8,
     },
     meta: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 8,
     },
     dateContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
     },
     date: {
          fontSize: 12,
     },
     overdue: {
          fontWeight: "600",
     },
});
