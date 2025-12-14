/**
 * Reusable task form component for Add/Edit screens
 */

import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";
import {Task, TaskCategory, TaskPriority} from "@/types/task";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, {useState} from "react";
import {
     Platform,
     ScrollView,
     StyleSheet,
     Text,
     TextInput,
     TouchableOpacity,
     View,
} from "react-native";
import {PriorityBadge} from "./PriorityBadge";

interface TaskFormProps {
     initialData?: Partial<Task>;
     onSubmit: (data: Omit<Task, "id" | "createdAt" | "completedAt">) => void;
     submitLabel?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
     initialData,
     onSubmit,
     submitLabel = "Save",
}) => {
     const {currentTheme} = useTheme();
     const isDark = currentTheme === "dark";

     const [title, setTitle] = useState(initialData?.title || "");
     const [description, setDescription] = useState(
          initialData?.description || ""
     );
     const [category, setCategory] = useState<TaskCategory>(
          initialData?.category || TaskCategory.PERSONAL
     );
     const [priority, setPriority] = useState<TaskPriority>(
          initialData?.priority || TaskPriority.MEDIUM
     );
     const [dueDate, setDueDate] = useState<Date | null>(
          initialData?.dueDate ? new Date(initialData.dueDate) : null
     );
     const [showDatePicker, setShowDatePicker] = useState(false);

     const backgroundColor = isDark
          ? Colors.dark.background
          : Colors.light.background;
     const textColor = isDark ? Colors.dark.text : Colors.light.text;
     const borderColor = isDark ? Colors.dark.border : Colors.light.border;
     const inputBackground = isDark ? Colors.dark.card : "#F9F9F9";

     const handleSubmit = () => {
          if (!title.trim()) {
               return;
          }

          onSubmit({
               title: title.trim(),
               description: description.trim() || undefined,
               category,
               priority,
               dueDate: dueDate?.toISOString(),
               completed: initialData?.completed || false,
          });
     };

     const categories: TaskCategory[] = [
          TaskCategory.WORK,
          TaskCategory.PERSONAL,
          TaskCategory.STUDY,
     ];
     const priorities: TaskPriority[] = [
          TaskPriority.LOW,
          TaskPriority.MEDIUM,
          TaskPriority.HIGH,
     ];

     return (
          <ScrollView style={[styles.container, {backgroundColor}]}>
               <ThemedView style={styles.form}>
                    {/* Title */}
                    <View style={styles.section}>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Title *
                         </ThemedText>
                         <TextInput
                              style={[
                                   styles.input,
                                   {
                                        backgroundColor: inputBackground,
                                        color: textColor,
                                        borderColor,
                                   },
                              ]}
                              value={title}
                              onChangeText={setTitle}
                              placeholder="Enter task title"
                              placeholderTextColor={isDark ? "#666" : "#999"}
                         />
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Description
                         </ThemedText>
                         <TextInput
                              style={[
                                   styles.textArea,
                                   {
                                        backgroundColor: inputBackground,
                                        color: textColor,
                                        borderColor,
                                   },
                              ]}
                              value={description}
                              onChangeText={setDescription}
                              placeholder="Enter task description (optional)"
                              placeholderTextColor={isDark ? "#666" : "#999"}
                              multiline
                              numberOfLines={4}
                              textAlignVertical="top"
                         />
                    </View>

                    {/* Category */}
                    <View style={styles.section}>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Category
                         </ThemedText>
                         <View style={styles.optionsRow}>
                              {categories.map((cat) => (
                                   <TouchableOpacity
                                        key={cat}
                                        onPress={() => setCategory(cat)}
                                        style={[
                                             styles.optionButton,
                                             {
                                                  backgroundColor:
                                                       category === cat
                                                            ? Colors[
                                                                   currentTheme
                                                              ].tint
                                                            : inputBackground,
                                                  borderColor:
                                                       category === cat
                                                            ? Colors[
                                                                   currentTheme
                                                              ].tint
                                                            : borderColor,
                                             },
                                        ]}>
                                        <Text
                                             style={[
                                                  styles.optionText,
                                                  {
                                                       color:
                                                            category === cat
                                                                 ? "#FFFFFF"
                                                                 : textColor,
                                                  },
                                             ]}>
                                             {cat}
                                        </Text>
                                   </TouchableOpacity>
                              ))}
                         </View>
                    </View>

                    {/* Priority */}
                    <View style={styles.section}>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Priority
                         </ThemedText>
                         <View style={styles.optionsRow}>
                              {priorities.map((pri) => (
                                   <TouchableOpacity
                                        key={pri}
                                        onPress={() => setPriority(pri)}
                                        style={[
                                             styles.optionButton,
                                             {
                                                  backgroundColor:
                                                       priority === pri
                                                            ? Colors[
                                                                   currentTheme
                                                              ].tint
                                                            : inputBackground,
                                                  borderColor:
                                                       priority === pri
                                                            ? Colors[
                                                                   currentTheme
                                                              ].tint
                                                            : borderColor,
                                             },
                                        ]}>
                                        <PriorityBadge priority={pri} />
                                   </TouchableOpacity>
                              ))}
                         </View>
                    </View>

                    {/* Due Date */}
                    <View style={styles.section}>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Due Date
                         </ThemedText>
                         <TouchableOpacity
                              onPress={() => setShowDatePicker(true)}
                              style={[
                                   styles.dateButton,
                                   {
                                        backgroundColor: inputBackground,
                                        borderColor,
                                   },
                              ]}>
                              <IconSymbol
                                   name="calendar"
                                   size={20}
                                   color={
                                        dueDate
                                             ? textColor
                                             : isDark
                                             ? "#666"
                                             : "#999"
                                   }
                              />
                              <Text
                                   style={[
                                        styles.dateText,
                                        {
                                             color: dueDate
                                                  ? textColor
                                                  : isDark
                                                  ? "#666"
                                                  : "#999",
                                        },
                                   ]}>
                                   {dueDate
                                        ? dueDate.toLocaleDateString("en-US", {
                                               year: "numeric",
                                               month: "short",
                                               day: "numeric",
                                          })
                                        : "Select due date (optional)"}
                              </Text>
                              {dueDate && (
                                   <TouchableOpacity
                                        onPress={(e) => {
                                             e.stopPropagation();
                                             setDueDate(null);
                                        }}
                                        style={styles.clearButton}>
                                        <IconSymbol
                                             name="xmark.circle.fill"
                                             size={20}
                                             color={textColor}
                                        />
                                   </TouchableOpacity>
                              )}
                         </TouchableOpacity>

                         {showDatePicker && (
                              <DateTimePicker
                                   value={dueDate || new Date()}
                                   mode="date"
                                   display={
                                        Platform.OS === "ios"
                                             ? "spinner"
                                             : "default"
                                   }
                                   onChange={(event, selectedDate) => {
                                        setShowDatePicker(
                                             Platform.OS === "ios"
                                        );
                                        if (selectedDate) {
                                             setDueDate(selectedDate);
                                        }
                                   }}
                                   minimumDate={new Date()}
                              />
                         )}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                         onPress={handleSubmit}
                         style={[
                              styles.submitButton,
                              {
                                   backgroundColor: title.trim()
                                        ? Colors[currentTheme].tint
                                        : borderColor,
                              },
                         ]}
                         disabled={!title.trim()}>
                         <ThemedText style={styles.submitText}>
                              {submitLabel}
                         </ThemedText>
                    </TouchableOpacity>
               </ThemedView>
          </ScrollView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     form: {
          padding: 16,
     },
     section: {
          marginBottom: 24,
     },
     label: {
          marginBottom: 8,
          fontSize: 14,
     },
     input: {
          height: 48,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          fontSize: 16,
     },
     textArea: {
          minHeight: 100,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          fontSize: 16,
     },
     optionsRow: {
          flexDirection: "row",
          gap: 8,
          flexWrap: "wrap",
     },
     optionButton: {
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 8,
          borderWidth: 1,
     },
     optionText: {
          fontSize: 14,
          fontWeight: "500",
     },
     dateButton: {
          flexDirection: "row",
          alignItems: "center",
          height: 48,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          gap: 8,
     },
     dateText: {
          flex: 1,
          fontSize: 16,
     },
     clearButton: {
          padding: 4,
     },
     submitButton: {
          height: 52,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 8,
          marginBottom: 32,
     },
     submitText: {
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "600",
     },
});
