/**
 * Settings Screen
 */

import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import * as storageService from "@/services/storage";
import {useProfile} from "@/store/ProfileContext";
import {useTasks} from "@/store/TaskContext";
import {useTheme} from "@/store/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
     Alert,
     ScrollView,
     StyleSheet,
     TouchableOpacity,
     View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function SettingsScreen() {
     const {currentTheme, themeMode, setThemeMode} = useTheme();
     const {tasks, loadTasks} = useTasks();
     const {loadProfile} = useProfile();
     const backgroundColor = Colors[currentTheme].background;
     const cardColor = Colors[currentTheme].card;
     const borderColor = Colors[currentTheme].border;
     const tintColor = Colors[currentTheme].tint;

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

     const handleResetApp = () => {
          Alert.alert(
               "Reset App Data",
               "This will clear all tasks, profile information, onboarding, and theme settings. The app will behave like a brand new install.\n\nAre you sure?",
               [
                    {text: "Cancel", style: "cancel"},
                    {
                         text: "Reset",
                         style: "destructive",
                         onPress: async () => {
                              try {
                                   // Clear known storage keys
                                   await AsyncStorage.multiRemove([
                                        "@todo_app:tasks",
                                        "@todo_app:profile",
                                        "@todo_app:onboarding_completed_v1",
                                        "@todo_app:theme_mode",
                                   ]);

                                   // Reload in-memory state
                                   await loadTasks();
                                   await loadProfile();
                                   await setThemeMode("system");

                                   Alert.alert(
                                        "App Reset",
                                        "All local data has been cleared."
                                   );
                              } catch (error) {
                                   console.error(
                                        "Error resetting app data:",
                                        error
                                   );
                                   Alert.alert(
                                        "Error",
                                        "Failed to reset app data"
                                   );
                              }
                         },
                    },
               ]
          );
     };

     const completedCount = tasks.filter((t) => t.completed).length;
     const pendingCount = tasks.filter((t) => !t.completed).length;

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
                    <View style={styles.titleSection}>
                         <ThemedText type="title" style={styles.title}>
                              Settings
                         </ThemedText>
                         <ThemedText
                              type="default"
                              style={[styles.subtitle, {opacity: 0.6}]}>
                              Customize your app
                         </ThemedText>
                    </View>
               </View>

               <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}>
                    {/* Appearance Section */}
                    <View
                         style={[
                              styles.sectionCard,
                              {backgroundColor: cardColor},
                         ]}>
                         <View style={styles.sectionHeader}>
                              <View
                                   style={[
                                        styles.iconBadge,
                                        {backgroundColor: tintColor + "20"},
                                   ]}>
                                   <IconSymbol
                                        name="gearshape.fill"
                                        size={16}
                                        color={tintColor}
                                   />
                              </View>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={styles.sectionTitle}>
                                   Appearance
                              </ThemedText>
                         </View>

                         <ThemedText
                              type="default"
                              style={[
                                   styles.sectionDescription,
                                   {opacity: 0.6},
                              ]}>
                              Choose your preferred theme
                         </ThemedText>

                         <View style={styles.themeOptions}>
                              {(["light", "dark", "system"] as const).map(
                                   (mode) => {
                                        const isActive = themeMode === mode;
                                        const modeLabels = {
                                             light: "Light",
                                             dark: "Dark",
                                             system: "System",
                                        };

                                        return (
                                             <TouchableOpacity
                                                  key={mode}
                                                  onPress={() =>
                                                       setThemeMode(mode)
                                                  }
                                                  activeOpacity={0.7}
                                                  style={[
                                                       styles.themeOption,
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
                                                            size={14}
                                                            color="#FFFFFF"
                                                            style={
                                                                 styles.checkIcon
                                                            }
                                                       />
                                                  )}
                                                  <ThemedText
                                                       style={[
                                                            styles.themeOptionText,
                                                            {
                                                                 color: isActive
                                                                      ? "#FFFFFF"
                                                                      : Colors[
                                                                             currentTheme
                                                                        ].text,
                                                            },
                                                       ]}>
                                                       {modeLabels[mode]}
                                                  </ThemedText>
                                             </TouchableOpacity>
                                        );
                                   }
                              )}
                         </View>
                    </View>

                    {/* Statistics Section */}
                    <View
                         style={[
                              styles.sectionCard,
                              {backgroundColor: cardColor},
                         ]}>
                         <View style={styles.sectionHeader}>
                              <View
                                   style={[
                                        styles.iconBadge,
                                        {backgroundColor: tintColor + "20"},
                                   ]}>
                                   <IconSymbol
                                        name="chart.bar"
                                        size={16}
                                        color={tintColor}
                                   />
                              </View>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={styles.sectionTitle}>
                                   Statistics
                              </ThemedText>
                         </View>

                         <View style={styles.statsGrid}>
                              <View style={styles.statItem}>
                                   <ThemedText
                                        type="default"
                                        style={[
                                             styles.statLabel,
                                             {opacity: 0.6},
                                        ]}>
                                        Total
                                   </ThemedText>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.statValue}>
                                        {tasks.length}
                                   </ThemedText>
                              </View>
                              <View
                                   style={[
                                        styles.statDivider,
                                        {backgroundColor: borderColor},
                                   ]}
                              />
                              <View style={styles.statItem}>
                                   <ThemedText
                                        type="default"
                                        style={[
                                             styles.statLabel,
                                             {opacity: 0.6},
                                        ]}>
                                        Completed
                                   </ThemedText>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={[
                                             styles.statValue,
                                             {color: "#10B981"},
                                        ]}>
                                        {completedCount}
                                   </ThemedText>
                              </View>
                              <View
                                   style={[
                                        styles.statDivider,
                                        {backgroundColor: borderColor},
                                   ]}
                              />
                              <View style={styles.statItem}>
                                   <ThemedText
                                        type="default"
                                        style={[
                                             styles.statLabel,
                                             {opacity: 0.6},
                                        ]}>
                                        Pending
                                   </ThemedText>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={[
                                             styles.statValue,
                                             {color: "#F59E0B"},
                                        ]}>
                                        {pendingCount}
                                   </ThemedText>
                              </View>
                         </View>
                    </View>

                    {/* Data Management Section */}
                    <View
                         style={[
                              styles.sectionCard,
                              {backgroundColor: cardColor},
                         ]}>
                         <View style={styles.sectionHeader}>
                              <View
                                   style={[
                                        styles.iconBadge,
                                        {backgroundColor: "#EF444420"},
                                   ]}>
                                   <IconSymbol
                                        name="trash"
                                        size={16}
                                        color="#EF4444"
                                   />
                              </View>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={styles.sectionTitle}>
                                   Data Management
                              </ThemedText>
                         </View>

                         <ThemedText
                              type="default"
                              style={[
                                   styles.sectionDescription,
                                   {opacity: 0.6},
                              ]}>
                              Permanently delete all your tasks
                         </ThemedText>

                         <TouchableOpacity
                              style={[
                                   styles.dangerButton,
                                   {
                                        backgroundColor: "#EF444410",
                                        borderColor: "#EF4444",
                                   },
                              ]}
                              onPress={handleClearAll}
                              activeOpacity={0.7}>
                              <IconSymbol
                                   name="trash.fill"
                                   size={18}
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

                         <TouchableOpacity
                              style={[
                                   styles.resetButton,
                                   {
                                        backgroundColor:
                                             currentTheme === "dark"
                                                  ? "#0F172A"
                                                  : "#FFFFFF",
                                        borderColor,
                                   },
                              ]}
                              onPress={handleResetApp}
                              activeOpacity={0.7}>
                              <IconSymbol
                                   name="gearshape.fill"
                                   size={18}
                                   color={tintColor}
                              />
                              <ThemedText
                                   style={[
                                        styles.resetText,
                                        {color: tintColor},
                                   ]}>
                                   Reset App Data (testing)
                              </ThemedText>
                         </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                         <View style={styles.footerContent}>
                              <IconSymbol
                                   name="paperplane.fill"
                                   size={16}
                                   color={tintColor}
                              />
                              <ThemedText
                                   type="default"
                                   style={[styles.footerText, {opacity: 0.6}]}>
                                   Advanced Todo App v1.0.0
                              </ThemedText>
                         </View>
                         <ThemedText
                              type="default"
                              style={[styles.footerText, {opacity: 0.5}]}>
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
     header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
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
     scrollView: {
          flex: 1,
     },
     content: {
          padding: 20,
          paddingBottom: 40,
     },
     sectionCard: {
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "transparent",
     },
     sectionHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
          gap: 10,
     },
     iconBadge: {
          width: 28,
          height: 28,
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
     },
     sectionTitle: {
          fontSize: 14,
          fontWeight: "700",
          letterSpacing: 0.2,
     },
     sectionDescription: {
          fontSize: 13,
          marginBottom: 16,
     },
     themeOptions: {
          flexDirection: "row",
          gap: 10,
     },
     themeOption: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 16,
          borderWidth: 1.5,
          gap: 6,
          minHeight: 44,
     },
     checkIcon: {
          marginRight: 2,
     },
     themeOptionText: {
          fontSize: 14,
          fontWeight: "600",
          letterSpacing: 0.2,
     },
     statsGrid: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingVertical: 8,
     },
     statItem: {
          flex: 1,
          alignItems: "center",
          gap: 4,
     },
     statDivider: {
          width: 1,
          height: 40,
          opacity: 0.3,
     },
     statLabel: {
          fontSize: 12,
          fontWeight: "500",
     },
     statValue: {
          fontSize: 24,
          fontWeight: "700",
     },
     dangerButton: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 1.5,
          minHeight: 50,
     },
     dangerText: {
          fontSize: 16,
          fontWeight: "600",
          letterSpacing: 0.2,
     },
     resetButton: {
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 1.5,
          minHeight: 48,
     },
     resetText: {
          fontSize: 14,
          fontWeight: "600",
          letterSpacing: 0.2,
     },
     footer: {
          paddingTop: 16,
          paddingBottom: 32,
          alignItems: "center",
          gap: 8,
     },
     footerContent: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
     },
     footerText: {
          fontSize: 12,
     },
});
