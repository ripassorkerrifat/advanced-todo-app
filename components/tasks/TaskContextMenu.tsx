/**
 * Context Menu for Task Quick Actions
 */

import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";
import {Task} from "@/types/task";
import React from "react";
import {
     Modal,
     StyleSheet,
     TouchableOpacity,
     TouchableWithoutFeedback,
     View,
} from "react-native";

interface TaskContextMenuProps {
     visible: boolean;
     task: Task | null;
     onClose: () => void;
     onEdit: () => void;
     onDelete: () => void;
     onToggleComplete: () => void;
     position?: {x: number; y: number};
}

export const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
     visible,
     task,
     onClose,
     onEdit,
     onDelete,
     onToggleComplete,
}) => {
     const {currentTheme} = useTheme();
     const backgroundColor = Colors[currentTheme].card;
     const borderColor = Colors[currentTheme].border;
     const tintColor = Colors[currentTheme].tint;
     const textColor = Colors[currentTheme].text;

     if (!visible || !task) {
          return null;
     }

     const menuItems = [
          {
               id: "complete",
               label: task.completed
                    ? "Mark as Incomplete"
                    : "Mark as Complete",
               icon: task.completed
                    ? "xmark.circle.fill"
                    : "checkmark.circle.fill",
               color: task.completed ? "#F59E0B" : "#10B981",
               onPress: () => {
                    onToggleComplete();
                    onClose();
               },
          },
          {
               id: "edit",
               label: "Edit Task",
               icon: "pencil",
               color: tintColor,
               onPress: () => {
                    onEdit();
                    onClose();
               },
          },
          {
               id: "delete",
               label: "Delete Task",
               icon: "trash",
               color: "#EF4444",
               onPress: () => {
                    onDelete();
                    onClose();
               },
          },
     ];

     return (
          <Modal
               visible={visible}
               transparent
               animationType="fade"
               onRequestClose={onClose}>
               <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlay}>
                         <TouchableWithoutFeedback>
                              <View
                                   style={[
                                        styles.menu,
                                        {
                                             backgroundColor,
                                             borderColor,
                                        },
                                   ]}>
                                   {menuItems.map((item) => (
                                        <TouchableOpacity
                                             key={item.id}
                                             onPress={item.onPress}
                                             style={styles.menuItem}
                                             activeOpacity={0.7}>
                                             <View
                                                  style={[
                                                       styles.menuIcon,
                                                       {
                                                            backgroundColor:
                                                                 item.color +
                                                                 "20",
                                                       },
                                                  ]}>
                                                  <IconSymbol
                                                       name={item.icon as any}
                                                       size={18}
                                                       color={item.color}
                                                  />
                                             </View>
                                             <ThemedText
                                                  style={[
                                                       styles.menuLabel,
                                                       {color: textColor},
                                                  ]}>
                                                  {item.label}
                                             </ThemedText>
                                        </TouchableOpacity>
                                   ))}
                              </View>
                         </TouchableWithoutFeedback>
                    </View>
               </TouchableWithoutFeedback>
          </Modal>
     );
};

const styles = StyleSheet.create({
     overlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
     },
     menu: {
          minWidth: 200,
          borderRadius: 16,
          padding: 8,
          borderWidth: 1,
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
     },
     menuItem: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          gap: 12,
     },
     menuIcon: {
          width: 32,
          height: 32,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
     },
     menuLabel: {
          fontSize: 15,
          fontWeight: "600",
          flex: 1,
     },
});
