/**
 * Empty state component when no tasks are found
 */

import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";
import React from "react";
import {StyleSheet} from "react-native";

interface EmptyStateProps {
     message?: string;
     icon?: "checkmark.circle" | "list.bullet";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
     message = "No tasks found",
     icon = "checkmark.circle",
}) => {
     const {currentTheme} = useTheme();
     const iconColor = Colors[currentTheme].icon;

     return (
          <ThemedView style={styles.container}>
               <IconSymbol name={icon} size={64} color={iconColor} />
               <ThemedText type="default" style={styles.text}>
                    {message}
               </ThemedText>
          </ThemedView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 64,
     },
     text: {
          marginTop: 16,
          opacity: 0.6,
     },
});
