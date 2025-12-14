/**
 * Undo snackbar component for task deletion
 */

import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";
import React, {useEffect, useRef} from "react";
import {Animated, StyleSheet, TouchableOpacity} from "react-native";

interface UndoSnackbarProps {
     visible: boolean;
     onUndo: () => void;
     onDismiss: () => void;
     message?: string;
     duration?: number;
}

const DEFAULT_DURATION = 5000; // 5 seconds

export const UndoSnackbar: React.FC<UndoSnackbarProps> = ({
     visible,
     onUndo,
     onDismiss,
     message = "Task deleted",
     duration = DEFAULT_DURATION,
}) => {
     const {currentTheme} = useTheme();
     const slideAnim = useRef(new Animated.Value(100)).current;
     const timeoutRef = useRef<NodeJS.Timeout | null>(null);

     useEffect(() => {
          if (visible) {
               // Slide in
               Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
               }).start();

               // Auto dismiss after duration
               timeoutRef.current = setTimeout(() => {
                    onDismiss();
               }, duration);
          } else {
               // Slide out
               Animated.timing(slideAnim, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
               }).start();
          }

          return () => {
               if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
               }
          };
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [visible, duration, slideAnim]);

     const handleDismiss = () => {
          if (timeoutRef.current) {
               clearTimeout(timeoutRef.current);
          }
          onDismiss();
     };

     const handleUndo = () => {
          if (timeoutRef.current) {
               clearTimeout(timeoutRef.current);
          }
          onUndo();
          handleDismiss();
     };

     if (!visible) return null;

     const backgroundColor =
          currentTheme === "dark" ? Colors.dark.card : "#111827";
     const textColor = "#FFFFFF";

     return (
          <Animated.View
               style={[
                    styles.container,
                    {
                         transform: [{translateY: slideAnim}],
                    },
               ]}>
               <ThemedView style={[styles.snackbar, {backgroundColor}]}>
                    <ThemedText style={[styles.message, {color: textColor}]}>
                         {message}
                    </ThemedText>
                    <TouchableOpacity
                         onPress={handleUndo}
                         style={styles.undoButton}>
                         <ThemedText
                              style={[styles.undoText, {color: "#60A5FA"}]}>
                              UNDO
                         </ThemedText>
                    </TouchableOpacity>
               </ThemedView>
          </Animated.View>
     );
};

const styles = StyleSheet.create({
     container: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: 16,
     },
     snackbar: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
     },
     message: {
          flex: 1,
          fontSize: 14,
          fontWeight: "500",
     },
     undoButton: {
          marginLeft: 16,
          paddingHorizontal: 12,
          paddingVertical: 6,
     },
     undoText: {
          fontSize: 14,
          fontWeight: "700",
          textTransform: "uppercase",
     },
});
