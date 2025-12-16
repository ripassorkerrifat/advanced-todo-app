/**
 * Empty state component when no tasks are found
 */

import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";
import React from "react";
import {StyleSheet, View} from "react-native";

interface EmptyStateProps {
     message?: string;
     icon?: "checkmark.circle" | "list.bullet";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
     message = "No tasks found",
     icon = "checkmark.circle",
}) => {
     const {currentTheme} = useTheme();
     const isDark = currentTheme === "dark";

     const primaryColor = Colors[currentTheme].primary;
     const cardColor =
          currentTheme === "dark" ? Colors.dark.card : Colors.light.card;
     const borderColor =
          currentTheme === "dark" ? Colors.dark.border : Colors.light.border;
     const iconColor = primaryColor;

     return (
          <ThemedView style={styles.container}>
               <View
                    style={[
                         styles.card,
                         {
                              backgroundColor: cardColor,
                              borderColor,
                              shadowColor: isDark ? "#000000" : primaryColor,
                         },
                    ]}>
                    <View
                         style={[
                              styles.iconWrapper,
                              {
                                   backgroundColor: primaryColor + "15",
                              },
                         ]}>
                         <IconSymbol name={icon} size={40} color={iconColor} />
                    </View>

                    <ThemedText type="defaultSemiBold" style={styles.title}>
                         You’re all caught up
                    </ThemedText>
                    <ThemedText type="default" style={styles.subtitle}>
                         {message}
                    </ThemedText>
               </View>
          </ThemedView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     card: {
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 28,
          borderRadius: 20,
          borderWidth: 1,
          shadowOffset: {width: 0, height: 8},
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 4,
          maxWidth: 320,
     },
     iconWrapper: {
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
     },
     title: {
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 4,
          textAlign: "center",
     },
     subtitle: {
          fontSize: 14,
          opacity: 0.7,
          textAlign: "center",
          lineHeight: 20,
     },
});
