/**
 * Settings Screen
 */

import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import * as storageService from "@/services/storage";
import {useTasks} from "@/store/TaskContext";
import {useTheme} from "@/store/ThemeContext";
import React from "react";
import {
     Alert,
     Platform,
     ScrollView,
     StyleSheet,
     Switch,
     TouchableOpacity,
     View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function SettingsScreen() {
     const {currentTheme, themeMode, setThemeMode} = useTheme();
     const {tasks, loadTasks} = useTasks();
     const backgroundColor =
          currentTheme === "dark"
               ? Colors.dark.background
               : Colors.light.background;
     const cardColor =
          currentTheme === "dark" ? Colors.dark.card : Colors.light.card;
     const borderColor =
          currentTheme === "dark" ? Colors.dark.border : Colors.light.border;

     const handleClearAll = () => {
          Alert.alert(
               "Clear All Tasks",
               `Are you sure you want to delete all ${tasks.length} tasks? This action cannot be undone.`,
               [
                    {text: "Cancel", style: "cancel"},
                    {
                         text: "Delete All",
                         style: "destructive",
                         onPress: async () => {
                              try {
                                   await storageService.clearAllTasks();
                                   await loadTasks();
                                   Alert.alert(
                                        "Success",
                                        "All tasks have been deleted"
                                   );
                              } catch (error) {
                                   console.error(
                                        "Error clearing tasks:",
                                        error
                                   );
                                   Alert.alert(
                                        "Error",
                                        "Failed to clear tasks"
                                   );
                              }
                         },
                    },
               ]
          );
     };

     return (
          <SafeAreaView
               style={[styles.container, {backgroundColor}]}
               edges={["top"]}>
               <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                         <ThemedText type="title" style={styles.title}>
                              Settings
                         </ThemedText>
                    </View>

                    {/* Theme Section */}
                    <View style={[styles.card, {backgroundColor: cardColor}]}>
                         <ThemedText
                              type="subtitle"
                              style={styles.sectionTitle}>
                              Appearance
                         </ThemedText>

                         <View style={styles.themeRow}>
                              <View style={styles.themeInfo}>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.label}>
                                        Theme
                                   </ThemedText>
                                   <ThemedText
                                        type="default"
                                        style={[
                                             styles.subLabel,
                                             {opacity: 0.6},
                                        ]}>
                                        {themeMode === "system"
                                             ? "System Default"
                                             : themeMode === "dark"
                                             ? "Dark Mode"
                                             : "Light Mode"}
                                   </ThemedText>
                              </View>
                              <Switch
                                   value={currentTheme === "dark"}
                                   onValueChange={(value: boolean) =>
                                        setThemeMode(value ? "dark" : "light")
                                   }
                                   trackColor={{
                                        false: "#E5E7EB",
                                        true: Colors.dark.primary,
                                   }}
                                   thumbColor={
                                        currentTheme === "dark"
                                             ? "#FFFFFF"
                                             : "#FFFFFF"
                                   }
                              />
                         </View>

                         <View style={styles.themeOptions}>
                              {(["light", "dark", "system"] as const).map(
                                   (mode) => (
                                        <TouchableOpacity
                                             key={mode}
                                             onPress={() => setThemeMode(mode)}
                                             style={[
                                                  styles.themeOption,
                                                  {
                                                       backgroundColor:
                                                            themeMode === mode
                                                                 ? Colors[
                                                                        currentTheme
                                                                   ].primary
                                                                 : "transparent",
                                                       borderColor:
                                                            themeMode === mode
                                                                 ? Colors[
                                                                        currentTheme
                                                                   ].primary
                                                                 : borderColor,
                                                  },
                                             ]}>
                                             <ThemedText
                                                  style={[
                                                       styles.themeOptionText,
                                                       {
                                                            color:
                                                                 themeMode ===
                                                                 mode
                                                                      ? "#FFFFFF"
                                                                      : Colors[
                                                                             currentTheme
                                                                        ].text,
                                                       },
                                                  ]}>
                                                  {mode === "system"
                                                       ? "System"
                                                       : mode === "dark"
                                                       ? "Dark"
                                                       : "Light"}
                                             </ThemedText>
                                        </TouchableOpacity>
                                   )
                              )}
                         </View>
                    </View>

                    {/* App Information */}
                    <View style={[styles.card, {backgroundColor: cardColor}]}>
                         <ThemedText
                              type="subtitle"
                              style={styles.sectionTitle}>
                              App Information
                         </ThemedText>

                         <View
                              style={[
                                   styles.row,
                                   {borderBottomColor: borderColor},
                              ]}>
                              <ThemedText type="default" style={styles.label}>
                                   Total Tasks
                              </ThemedText>
                              <ThemedText type="defaultSemiBold">
                                   {tasks.length}
                              </ThemedText>
                         </View>

                         <View
                              style={[
                                   styles.row,
                                   {borderBottomColor: borderColor},
                              ]}>
                              <ThemedText type="default" style={styles.label}>
                                   Completed Tasks
                              </ThemedText>
                              <ThemedText type="defaultSemiBold">
                                   {tasks.filter((t) => t.completed).length}
                              </ThemedText>
                         </View>

                         <View style={styles.row}>
                              <ThemedText type="default" style={styles.label}>
                                   Pending Tasks
                              </ThemedText>
                              <ThemedText type="defaultSemiBold">
                                   {tasks.filter((t) => !t.completed).length}
                              </ThemedText>
                         </View>
                    </View>

                    {/* Data Management */}
                    <View style={[styles.card, {backgroundColor: cardColor}]}>
                         <ThemedText
                              type="subtitle"
                              style={styles.sectionTitle}>
                              Data Management
                         </ThemedText>

                         <TouchableOpacity
                              style={[
                                   styles.dangerButton,
                                   {borderColor: "#EF4444"},
                              ]}
                              onPress={handleClearAll}>
                              <IconSymbol
                                   name="trash"
                                   size={20}
                                   color="#EF4444"
                              />
                              <ThemedText
                                   style={[
                                        styles.dangerText,
                                        {color: "#EF4444"},
                                   ]}>
                                   Clear All Tasks
                              </ThemedText>
                         </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                         <ThemedText type="default" style={styles.footerText}>
                              Advanced Todo App v1.0.0
                         </ThemedText>
                         <ThemedText type="default" style={styles.footerText}>
                              Built with React Native & Expo
                         </ThemedText>
                    </View>
               </ScrollView>
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     scrollView: {
          flex: 1,
     },
     content: {
          padding: 16,
     },
     header: {
          paddingBottom: 24,
          paddingTop: Platform.OS === "ios" ? 0 : 20,
     },
     title: {
          fontSize: 32,
          fontWeight: "700",
     },
     card: {
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
     },
     sectionTitle: {
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 16,
     },
     themeRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
     },
     themeInfo: {
          flex: 1,
     },
     label: {
          fontSize: 16,
          marginBottom: 4,
     },
     subLabel: {
          fontSize: 14,
     },
     themeOptions: {
          flexDirection: "row",
          gap: 8,
     },
     themeOption: {
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: "center",
     },
     themeOptionText: {
          fontSize: 14,
          fontWeight: "500",
     },
     row: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
     },
     dangerButton: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          justifyContent: "center",
     },
     dangerText: {
          fontSize: 16,
          fontWeight: "600",
     },
     footer: {
          paddingBottom: 32,
          alignItems: "center",
          gap: 4,
          marginTop: 8,
     },
     footerText: {
          fontSize: 12,
          opacity: 0.6,
     },
});
