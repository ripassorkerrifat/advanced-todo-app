/**
 * Category color indicator component
 */

import {TaskCategory} from "@/types/task";
import {getCategoryColor} from "@/utils/task";
import React from "react";
import {StyleSheet, View} from "react-native";

interface CategoryIndicatorProps {
     category: TaskCategory;
}

export const CategoryIndicator: React.FC<CategoryIndicatorProps> = ({
     category,
}) => {
     const color = getCategoryColor(category);

     return <View style={[styles.indicator, {backgroundColor: color}]} />;
};

const styles = StyleSheet.create({
     indicator: {
          width: 4,
          height: "100%",
          borderRadius: 2,
     },
});
