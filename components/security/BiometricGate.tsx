/**
 * Biometric gate wrapper
 * - Uses fingerprint / Face ID / device biometrics to unlock the app
 * - Runs once when the app starts
 */

import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";
import * as LocalAuthentication from "expo-local-authentication";
import React, {useEffect, useState} from "react";
import {
     ActivityIndicator,
     StyleSheet,
     TouchableOpacity,
     View,
} from "react-native";

interface BiometricGateProps {
     children: React.ReactNode;
}

export const BiometricGate: React.FC<BiometricGateProps> = ({children}) => {
     const {currentTheme} = useTheme();
     const [loading, setLoading] = useState(true);
     const [unlocked, setUnlocked] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const backgroundColor = Colors[currentTheme].background;
     const textColor = Colors[currentTheme].text;
     const tintColor = Colors[currentTheme].primary;
     const cardColor =
          currentTheme === "dark" ? Colors.dark.card : Colors.light.card;
     const borderColor =
          currentTheme === "dark" ? Colors.dark.border : Colors.light.border;

     const runAuth = async () => {
          setError(null);
          setLoading(true);

          try {
               const hasHardware = await LocalAuthentication.hasHardwareAsync();
               const isEnrolled = await LocalAuthentication.isEnrolledAsync();

               if (!hasHardware || !isEnrolled) {
                    // If device does not support biometrics or none enrolled:
                    // allow access to keep the app usable on all devices.
                    setUnlocked(true);
                    return;
               }

               const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Unlock your tasks",
                    fallbackLabel: "Use device passcode",
                    cancelLabel: "Cancel",
               });

               if (result.success) {
                    setUnlocked(true);
               } else {
                    setError("Authentication failed. Tap to try again.");
               }
          } catch {
               // On unexpected error, allow access but show a note
               setError("Biometric authentication not available.");
               setUnlocked(true);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          runAuth();
     }, []);

     if (unlocked) {
          return <>{children}</>;
     }

     return (
          <ThemedView style={[styles.container, {backgroundColor}]}>
               <View
                    style={[
                         styles.card,
                         {
                              backgroundColor: cardColor,
                              borderColor,
                              shadowColor: tintColor,
                         },
                    ]}>
                    <View
                         style={[
                              styles.iconWrapper,
                              {backgroundColor: tintColor + "15"},
                         ]}>
                         <IconSymbol
                              name="lock.fill"
                              size={30}
                              color={tintColor}
                         />
                    </View>

                    {loading ? (
                         <>
                              <ActivityIndicator
                                   size="large"
                                   color={tintColor}
                              />
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={[styles.title, {color: textColor}]}>
                                   Verifying identity...
                              </ThemedText>
                              <ThemedText
                                   type="default"
                                   style={[
                                        styles.subtitle,
                                        {color: textColor, opacity: 0.7},
                                   ]}>
                                   Please confirm it&apos;s you to open your
                                   tasks.
                              </ThemedText>
                         </>
                    ) : (
                         <>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={[styles.title, {color: textColor}]}>
                                   Unlock to continue
                              </ThemedText>
                              {error && (
                                   <ThemedText
                                        type="default"
                                        style={[
                                             styles.error,
                                             {color: tintColor},
                                        ]}>
                                        {error}
                                   </ThemedText>
                              )}
                              <TouchableOpacity
                                   style={[
                                        styles.button,
                                        {backgroundColor: tintColor},
                                   ]}
                                   onPress={runAuth}
                                   activeOpacity={0.85}>
                                   <ThemedText style={styles.buttonText}>
                                        Try Again
                                   </ThemedText>
                              </TouchableOpacity>
                         </>
                    )}
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
          paddingHorizontal: 24,
          paddingVertical: 32,
          borderRadius: 20,
          borderWidth: 1,
          alignItems: "center",
          gap: 12,
          maxWidth: 320,
          shadowOffset: {width: 0, height: 8},
          shadowOpacity: 0.16,
          shadowRadius: 18,
          elevation: 8,
     },
     iconWrapper: {
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 4,
     },
     title: {
          fontSize: 18,
          fontWeight: "700",
          textAlign: "center",
     },
     subtitle: {
          fontSize: 14,
          textAlign: "center",
          marginTop: 4,
     },
     error: {
          fontSize: 13,
          textAlign: "center",
          marginTop: 4,
     },
     button: {
          marginTop: 10,
          borderRadius: 999,
          paddingHorizontal: 24,
          paddingVertical: 10,
     },
     buttonText: {
          color: "#FFFFFF",
          fontWeight: "700",
          fontSize: 15,
     },
});
