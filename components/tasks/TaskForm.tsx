/**
 * Reusable task form component for Add/Edit screens
 */

import {ThemedText} from "@/components/themed-text";
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
     const [notes, setNotes] = useState(initialData?.notes || "");
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
     const [isNotesExpanded, setIsNotesExpanded] = useState(false);

     const backgroundColor = isDark
          ? Colors.dark.background
          : Colors.light.background;
     const textColor = isDark ? Colors.dark.text : Colors.light.text;
     const borderColor = isDark ? Colors.dark.border : Colors.light.border;

     const handleSubmit = () => {
          if (!title.trim()) {
               return;
          }

          onSubmit({
               title: title.trim(),
               description: description.trim() || undefined,
               notes: notes.trim() || undefined,
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

     const cardColor = isDark ? Colors.dark.card : Colors.light.card;
     const tintColor = Colors[currentTheme].tint;

     return (
          <ScrollView
               style={[styles.container, {backgroundColor}]}
               contentContainerStyle={styles.contentContainer}
               showsVerticalScrollIndicator={false}>
               {/* Title Section */}
               <View style={[styles.formCard, {backgroundColor: cardColor}]}>
                    <View style={styles.sectionHeader}>
                         <View
                              style={[
                                   styles.iconBadge,
                                   {backgroundColor: tintColor + "20"},
                              ]}>
                              <IconSymbol
                                   name="text.alignleft"
                                   size={16}
                                   color={tintColor}
                              />
                         </View>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Task Title *
                         </ThemedText>
                    </View>
                    <TextInput
                         style={[
                              styles.input,
                              {
                                   backgroundColor: backgroundColor,
                                   color: textColor,
                                   borderColor,
                              },
                         ]}
                         value={title}
                         onChangeText={setTitle}
                         placeholder="Enter task title"
                         placeholderTextColor={isDark ? "#94A3B8" : "#9CA3AF"}
                    />
               </View>

               {/* Description Section */}
               <View style={[styles.formCard, {backgroundColor: cardColor}]}>
                    <View style={styles.sectionHeader}>
                         <View
                              style={[
                                   styles.iconBadge,
                                   {backgroundColor: tintColor + "20"},
                              ]}>
                              <IconSymbol
                                   name="doc.text"
                                   size={16}
                                   color={tintColor}
                              />
                         </View>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Description
                         </ThemedText>
                    </View>
                    <TextInput
                         style={[
                              styles.textArea,
                              {
                                   backgroundColor: backgroundColor,
                                   color: textColor,
                                   borderColor,
                              },
                         ]}
                         value={description}
                         onChangeText={setDescription}
                         placeholder="Add a description (optional)"
                         placeholderTextColor={isDark ? "#94A3B8" : "#9CA3AF"}
                         multiline
                         numberOfLines={4}
                         textAlignVertical="top"
                    />
               </View>

               {/* Notes Section */}
               <View style={[styles.formCard, {backgroundColor: cardColor}]}>
                    <View style={styles.sectionHeader}>
                         <View
                              style={[
                                   styles.iconBadge,
                                   {backgroundColor: tintColor + "20"},
                              ]}>
                              <IconSymbol
                                   name="doc.text"
                                   size={16}
                                   color={tintColor}
                              />
                         </View>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Notes
                         </ThemedText>
                         <View style={styles.notesHeaderRight}>
                              <ThemedText
                                   type="default"
                                   style={[styles.charCount, {opacity: 0.6}]}>
                                   {notes.length}/2000
                              </ThemedText>
                              <TouchableOpacity
                                   onPress={() =>
                                        setIsNotesExpanded(!isNotesExpanded)
                                   }
                                   activeOpacity={0.7}>
                                   <IconSymbol
                                        name={
                                             isNotesExpanded
                                                  ? "chevron.up"
                                                  : "chevron.down"
                                        }
                                        size={16}
                                        color={tintColor}
                                   />
                              </TouchableOpacity>
                         </View>
                    </View>
                    {isNotesExpanded && (
                         <TextInput
                              style={[
                                   styles.notesInput,
                                   {
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        borderColor,
                                   },
                              ]}
                              value={notes}
                              onChangeText={(text) => {
                                   if (text.length <= 2000) {
                                        setNotes(text);
                                   }
                              }}
                              placeholder="Add detailed notes (supports markdown)"
                              placeholderTextColor={
                                   isDark ? "#94A3B8" : "#9CA3AF"
                              }
                              multiline
                              numberOfLines={8}
                              textAlignVertical="top"
                              maxLength={2000}
                         />
                    )}
                    {!isNotesExpanded && notes.length > 0 && (
                         <TouchableOpacity
                              onPress={() => setIsNotesExpanded(true)}
                              activeOpacity={0.7}>
                              <ThemedText
                                   type="default"
                                   style={[styles.notesPreview, {opacity: 0.7}]}
                                   numberOfLines={2}>
                                   {notes}
                              </ThemedText>
                         </TouchableOpacity>
                    )}
               </View>

               {/* Category Section */}
               <View style={[styles.formCard, {backgroundColor: cardColor}]}>
                    <View style={styles.sectionHeader}>
                         <View
                              style={[
                                   styles.iconBadge,
                                   {backgroundColor: tintColor + "20"},
                              ]}>
                              <IconSymbol
                                   name="folder"
                                   size={16}
                                   color={tintColor}
                              />
                         </View>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Category
                         </ThemedText>
                    </View>
                    <View style={styles.optionsRow}>
                         {categories.map((cat) => (
                              <TouchableOpacity
                                   key={cat}
                                   onPress={() => setCategory(cat)}
                                   activeOpacity={0.7}
                                   style={[
                                        styles.optionButton,
                                        {
                                             backgroundColor:
                                                  category === cat
                                                       ? tintColor
                                                       : "transparent",
                                             borderColor:
                                                  category === cat
                                                       ? tintColor
                                                       : borderColor,
                                        },
                                   ]}>
                                   {category === cat && (
                                        <IconSymbol
                                             name="checkmark"
                                             size={14}
                                             color="#FFFFFF"
                                             style={styles.checkIcon}
                                        />
                                   )}
                                   <ThemedText
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
                                   </ThemedText>
                              </TouchableOpacity>
                         ))}
                    </View>
               </View>

               {/* Priority Section */}
               <View style={[styles.formCard, {backgroundColor: cardColor}]}>
                    <View style={styles.sectionHeader}>
                         <View
                              style={[
                                   styles.iconBadge,
                                   {backgroundColor: tintColor + "20"},
                              ]}>
                              <IconSymbol
                                   name="flag"
                                   size={16}
                                   color={tintColor}
                              />
                         </View>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.label}>
                              Priority
                         </ThemedText>
                    </View>
                    <View style={styles.optionsRow}>
                         {priorities.map((pri) => (
                              <TouchableOpacity
                                   key={pri}
                                   onPress={() => setPriority(pri)}
                                   activeOpacity={0.7}
                                   style={[
                                        styles.priorityButton,
                                        {
                                             backgroundColor:
                                                  priority === pri
                                                       ? tintColor
                                                       : "transparent",
                                             borderColor:
                                                  priority === pri
                                                       ? tintColor
                                                       : borderColor,
                                        },
                                   ]}>
                                   {priority === pri && (
                                        <IconSymbol
                                             name="checkmark"
                                             size={12}
                                             color="#FFFFFF"
                                             style={styles.checkIcon}
                                        />
                                   )}
                                   <PriorityBadge priority={pri} />
                              </TouchableOpacity>
                         ))}
                    </View>
               </View>

               {/* Due Date Section */}
               <View style={[styles.formCard, {backgroundColor: cardColor}]}>
                    <View style={styles.sectionHeader}>
                         <View
                              style={[
                                   styles.iconBadge,
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
                              style={styles.label}>
                              Due Date
                         </ThemedText>
                    </View>
                    <TouchableOpacity
                         onPress={() => setShowDatePicker(true)}
                         activeOpacity={0.7}
                         style={[
                              styles.dateButton,
                              {
                                   backgroundColor: backgroundColor,
                                   borderColor,
                              },
                         ]}>
                         <IconSymbol
                              name="calendar"
                              size={18}
                              color={
                                   dueDate
                                        ? tintColor
                                        : isDark
                                        ? "#64748B"
                                        : "#9CA3AF"
                              }
                         />
                         <ThemedText
                              style={[
                                   styles.dateText,
                                   {
                                        color: dueDate
                                             ? textColor
                                             : isDark
                                             ? "#94A3B8"
                                             : "#9CA3AF",
                                   },
                              ]}>
                              {dueDate
                                   ? dueDate.toLocaleDateString("en-US", {
                                          weekday: "short",
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                     })
                                   : "Select due date (optional)"}
                         </ThemedText>
                         {dueDate && (
                              <TouchableOpacity
                                   onPress={(e) => {
                                        e.stopPropagation();
                                        setDueDate(null);
                                   }}
                                   style={styles.clearButton}
                                   activeOpacity={0.7}>
                                   <IconSymbol
                                        name="xmark.circle.fill"
                                        size={18}
                                        color={isDark ? "#CBD5E1" : "#6B7280"}
                                   />
                              </TouchableOpacity>
                         )}
                    </TouchableOpacity>

                    {showDatePicker && (
                         <DateTimePicker
                              value={dueDate || new Date()}
                              mode="date"
                              display={
                                   Platform.OS === "ios" ? "spinner" : "default"
                              }
                              onChange={(event, selectedDate) => {
                                   setShowDatePicker(Platform.OS === "ios");
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
                    activeOpacity={0.8}
                    style={[
                         styles.submitButton,
                         {
                              backgroundColor: title.trim()
                                   ? tintColor
                                   : borderColor,
                              shadowColor: title.trim()
                                   ? tintColor
                                   : "transparent",
                         },
                    ]}
                    disabled={!title.trim()}>
                    <IconSymbol
                         name="checkmark.circle.fill"
                         size={20}
                         color="#FFFFFF"
                         style={styles.submitIcon}
                    />
                    <ThemedText style={styles.submitText}>
                         {submitLabel}
                    </ThemedText>
               </TouchableOpacity>
          </ScrollView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     contentContainer: {
          padding: 20,
          paddingBottom: 40,
     },
     formCard: {
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "transparent",
     },
     sectionHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          gap: 10,
     },
     iconBadge: {
          width: 28,
          height: 28,
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
     },
     label: {
          fontSize: 14,
          fontWeight: "700",
          letterSpacing: 0.2,
          // Color will be set by ThemedText component
     },
     input: {
          height: 50,
          borderWidth: 1.5,
          borderRadius: 12,
          paddingHorizontal: 16,
          fontSize: 16,
          fontWeight: "500",
     },
     textArea: {
          minHeight: 110,
          borderWidth: 1.5,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          fontWeight: "400",
     },
     notesHeaderRight: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginLeft: "auto",
     },
     charCount: {
          fontSize: 12,
          fontWeight: "500",
     },
     notesInput: {
          minHeight: 150,
          borderWidth: 1.5,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 15,
          fontWeight: "400",
          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
     },
     notesPreview: {
          fontSize: 14,
          lineHeight: 20,
          paddingVertical: 8,
     },
     optionsRow: {
          flexDirection: "row",
          gap: 10,
          flexWrap: "wrap",
     },
     optionButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 16,
          borderWidth: 1.5,
          minHeight: 32,
          gap: 6,
     },
     checkIcon: {
          marginRight: 2,
     },
     optionText: {
          fontSize: 14,
          fontWeight: "600",
          letterSpacing: 0.2,
     },
     priorityButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          borderWidth: 1.5,
          minHeight: 32,
          gap: 6,
     },
     dateButton: {
          flexDirection: "row",
          alignItems: "center",
          height: 50,
          borderWidth: 1.5,
          borderRadius: 12,
          paddingHorizontal: 16,
          gap: 12,
     },
     dateText: {
          flex: 1,
          fontSize: 16,
          fontWeight: "500",
     },
     clearButton: {
          padding: 4,
     },
     submitButton: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 56,
          borderRadius: 16,
          marginTop: 8,
          gap: 8,
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
     },
     submitIcon: {
          marginRight: 2,
     },
     submitText: {
          color: "#FFFFFF",
          fontSize: 17,
          fontWeight: "700",
          letterSpacing: 0.3,
     },
     recurrenceOptions: {
          marginTop: 16,
          gap: 16,
     },
     intervalRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
     },
     intervalLabel: {
          fontSize: 14,
          fontWeight: "500",
     },
     intervalInput: {
          width: 60,
          height: 40,
          borderWidth: 1.5,
          borderRadius: 10,
          paddingHorizontal: 10,
          justifyContent: "center",
     },
     intervalTextInput: {
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
     },
     daysOfWeekContainer: {
          gap: 12,
     },
     daysOfWeekRow: {
          flexDirection: "row",
          gap: 8,
          flexWrap: "wrap",
     },
     dayButton: {
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 1.5,
          justifyContent: "center",
          alignItems: "center",
     },
     dayButtonText: {
          fontSize: 12,
          fontWeight: "600",
     },
     endDateRow: {
          gap: 10,
     },
     clearDateButton: {
          padding: 4,
     },
     recurrencePreview: {
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          borderRadius: 10,
          borderWidth: 1,
          gap: 8,
          marginTop: 8,
     },
     recurrencePreviewText: {
          fontSize: 13,
          fontWeight: "600",
          flex: 1,
     },
});
