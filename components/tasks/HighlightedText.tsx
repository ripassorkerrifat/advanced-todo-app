/**
 * Text component that highlights matching search query
 */

import {ThemedText} from "@/components/themed-text";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";
import {highlightText} from "@/utils/task";
import React from "react";
import {StyleSheet, Text} from "react-native";

interface HighlightedTextProps {
     text: string;
     query: string;
     style?: any;
     numberOfLines?: number;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
     text,
     query,
     style,
     numberOfLines,
}) => {
     const {currentTheme} = useTheme();
     const tintColor = Colors[currentTheme].tint;

     if (!query.trim()) {
          return (
               <ThemedText style={style} numberOfLines={numberOfLines}>
                    {text}
               </ThemedText>
          );
     }

     const parts = highlightText(text, query);

     return (
          <ThemedText style={style} numberOfLines={numberOfLines}>
               {parts.map((part, index) => (
                    <Text
                         key={index}
                         style={
                              part.highlight
                                   ? [
                                          styles.highlight,
                                          {backgroundColor: tintColor + "40"},
                                     ]
                                   : undefined
                         }>
                         {part.text}
                    </Text>
               ))}
          </ThemedText>
     );
};

const styles = StyleSheet.create({
     highlight: {
          fontWeight: "700",
     },
});
