/**
 * Priority badge component
 */

import {TaskPriority} from "@/types/task";
import {getPriorityColor} from "@/utils/task";
import React from "react";
import {StyleSheet, Text, View} from "react-native";

interface PriorityBadgeProps {
     priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({priority}) => {
     const color = getPriorityColor(priority);

     return (
          <View style={[styles.badge, {backgroundColor: color}]}>
               <Text style={styles.text}>{priority}</Text>
          </View>
     );
};

const styles = StyleSheet.create({
     badge: {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          alignSelf: "flex-start",
     },
     text: {
          color: "#FFFFFF",
          fontSize: 10,
          fontWeight: "600",
          textTransform: "uppercase",
     },
});
