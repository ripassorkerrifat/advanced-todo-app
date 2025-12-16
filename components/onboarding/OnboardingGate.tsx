/**
 * OnboardingGate
 * - Shows a 2–3 step onboarding / intro flow the first time the app is opened
 * - First step collects name, email, phone and stores it in ProfileContext
 * - Afterwards, marks onboarding as completed and always renders children
 */

import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useProfile} from "@/store/ProfileContext";
import {useTheme} from "@/store/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useEffect, useState} from "react";
import {
     ActivityIndicator,
     ImageBackground,
     KeyboardAvoidingView,
     Platform,
     StyleSheet,
     TextInput,
     TouchableOpacity,
     View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const ONBOARDING_KEY = "@todo_app:onboarding_completed_v1";

interface OnboardingGateProps {
     children: React.ReactNode;
}

export const OnboardingGate: React.FC<OnboardingGateProps> = ({children}) => {
     const {currentTheme} = useTheme();
     const {updateProfile, profile} = useProfile();

     const [checking, setChecking] = useState(true);
     const [showOnboarding, setShowOnboarding] = useState(false);
     const [step, setStep] = useState(0);

     const [name, setName] = useState(profile?.name ?? "");
     const [email, setEmail] = useState(profile?.email ?? "");
     const [phone, setPhone] = useState(profile?.phone ?? "");
     const [saving, setSaving] = useState(false);

     const backgroundColor = Colors[currentTheme].background;
     const textColor = Colors[currentTheme].text;
     const tintColor = Colors[currentTheme].primary;
     const cardColor =
          currentTheme === "dark" ? Colors.dark.card : Colors.light.card;
     const borderColor =
          currentTheme === "dark" ? Colors.dark.border : Colors.light.border;

     useEffect(() => {
          const checkOnboarding = async () => {
               try {
                    const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
                    if (stored === "true") {
                         setShowOnboarding(false);
                    } else {
                         setShowOnboarding(true);
                    }
               } catch {
                    setShowOnboarding(false);
               } finally {
                    setChecking(false);
               }
          };
          checkOnboarding();
     }, []);

     const completeOnboarding = async () => {
          try {
               await AsyncStorage.setItem(ONBOARDING_KEY, "true");
          } catch {
               // ignore write errors; not critical
          }
          setShowOnboarding(false);
     };

     const handleNextFromProfile = async () => {
          if (!name.trim() || !email.trim() || !phone.trim()) {
               return;
          }
          setSaving(true);
          try {
               await updateProfile({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
               });
               setStep(1);
          } catch {
               // If saving fails, still allow user to move on to keep UX smooth
               setStep(1);
          } finally {
               setSaving(false);
          }
     };

     const handleSkipAll = () => {
          // Only allow skipping the whole onboarding if we already have a profile
          // or the user is past the profile step. For brand new users, profile
          // info is required.
          const hasProfile = !!profile;
          if (!hasProfile && step === 0) {
               return;
          }
          completeOnboarding();
     };

     const handleNext = () => {
          if (step === 0) {
               void handleNextFromProfile();
          } else if (step === 1) {
               setStep(2);
          } else {
               completeOnboarding();
          }
     };

     if (checking || !showOnboarding) {
          return <>{children}</>;
     }

     const isProfileStep = step === 0;
     const hasProfile = !!profile;
     const primaryActionLabel =
          step === 0 ? "Continue" : step === 1 ? "Next" : "Get Started";

     return (
          <ThemedView style={{flex: 1, backgroundColor}}>
               <SafeAreaView style={{flex: 1}}>
                    <KeyboardAvoidingView
                         style={{flex: 1}}
                         behavior={
                              Platform.OS === "ios" ? "padding" : undefined
                         }>
                         {/* Top bar with Skip */}
                         <View style={styles.topBar}>
                              {(hasProfile || !isProfileStep) && (
                                   <TouchableOpacity
                                        onPress={handleSkipAll}
                                        hitSlop={{
                                             top: 12,
                                             bottom: 12,
                                             left: 12,
                                             right: 12,
                                        }}>
                                        <ThemedText
                                             type="defaultSemiBold"
                                             style={[
                                                  styles.skipText,
                                                  {
                                                       color: textColor,
                                                       opacity: 0.7,
                                                  },
                                             ]}>
                                             Skip
                                        </ThemedText>
                                   </TouchableOpacity>
                              )}
                         </View>

                         {/* Illustration area */}
                         <View style={styles.illustrationWrapper}>
                              <View style={styles.illustrationContainer}>
                                   <ImageBackground
                                        source={{
                                             uri: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                        }}
                                        resizeMode="cover"
                                        style={styles.illustrationImage}>
                                        <View
                                             style={[
                                                  styles.illustrationOverlay,
                                                  {
                                                       backgroundColor:
                                                            tintColor + "40",
                                                  },
                                             ]}>
                                             <View
                                                  style={
                                                       styles.illustrationInner
                                                  }>
                                                  <IconSymbol
                                                       name="list.bullet"
                                                       size={40}
                                                       color="#FFFFFF"
                                                  />
                                                  <IconSymbol
                                                       name="checkmark.circle.fill"
                                                       size={28}
                                                       color="#FFFFFF"
                                                  />
                                             </View>
                                             <ThemedText
                                                  type="defaultSemiBold"
                                                  style={
                                                       styles.illustrationTitle
                                                  }>
                                                  Plan. Focus. Finish.
                                             </ThemedText>
                                             <ThemedText
                                                  type="default"
                                                  style={
                                                       styles.illustrationSubtitle
                                                  }>
                                                  Your offline command center
                                                  for daily tasks.
                                             </ThemedText>
                                        </View>
                                   </ImageBackground>
                              </View>
                         </View>

                         {/* Content card */}
                         <View
                              style={[
                                   styles.contentCard,
                                   {
                                        backgroundColor: cardColor,
                                        borderColor,
                                   },
                              ]}>
                              {/* Dots / step indicator */}
                              <View style={styles.dotsRow}>
                                   {[0, 1, 2].map((i) => (
                                        <View
                                             key={i}
                                             style={[
                                                  styles.dot,
                                                  {
                                                       backgroundColor:
                                                            i === step
                                                                 ? tintColor
                                                                 : borderColor,
                                                       opacity:
                                                            i === step
                                                                 ? 1
                                                                 : 0.5,
                                                  },
                                             ]}
                                        />
                                   ))}
                              </View>

                              {isProfileStep ? (
                                   <>
                                        <ThemedText
                                             type="defaultSemiBold"
                                             style={[
                                                  styles.title,
                                                  {color: textColor},
                                             ]}>
                                             Welcome! Let&apos;s personalize
                                             your space
                                        </ThemedText>
                                        <ThemedText
                                             type="default"
                                             style={[
                                                  styles.subtitle,
                                                  {
                                                       color: textColor,
                                                       opacity: 0.7,
                                                  },
                                             ]}>
                                             Tell us a bit about you so we can
                                             keep your tasks more personal.
                                        </ThemedText>

                                        <View style={styles.form}>
                                             <View style={styles.field}>
                                                  <ThemedText
                                                       type="defaultSemiBold"
                                                       style={[
                                                            styles.fieldLabel,
                                                            {color: textColor},
                                                       ]}>
                                                       Name
                                                  </ThemedText>
                                                  <TextInput
                                                       style={[
                                                            styles.input,
                                                            {
                                                                 borderColor,
                                                                 color: textColor,
                                                            },
                                                       ]}
                                                       placeholder="John Doe"
                                                       placeholderTextColor={
                                                            currentTheme ===
                                                            "dark"
                                                                 ? "#94A3B8"
                                                                 : "#9CA3AF"
                                                       }
                                                       value={name}
                                                       onChangeText={setName}
                                                  />
                                             </View>

                                             <View style={styles.field}>
                                                  <ThemedText
                                                       type="defaultSemiBold"
                                                       style={[
                                                            styles.fieldLabel,
                                                            {color: textColor},
                                                       ]}>
                                                       Email
                                                  </ThemedText>
                                                  <TextInput
                                                       style={[
                                                            styles.input,
                                                            {
                                                                 borderColor,
                                                                 color: textColor,
                                                            },
                                                       ]}
                                                       placeholder="you@example.com"
                                                       placeholderTextColor={
                                                            currentTheme ===
                                                            "dark"
                                                                 ? "#94A3B8"
                                                                 : "#9CA3AF"
                                                       }
                                                       autoCapitalize="none"
                                                       keyboardType="email-address"
                                                       value={email}
                                                       onChangeText={setEmail}
                                                  />
                                             </View>

                                             <View style={styles.field}>
                                                  <ThemedText
                                                       type="defaultSemiBold"
                                                       style={[
                                                            styles.fieldLabel,
                                                            {color: textColor},
                                                       ]}>
                                                       Phone
                                                  </ThemedText>
                                                  <TextInput
                                                       style={[
                                                            styles.input,
                                                            {
                                                                 borderColor,
                                                                 color: textColor,
                                                            },
                                                       ]}
                                                       placeholder="+1 555 123 4567"
                                                       placeholderTextColor={
                                                            currentTheme ===
                                                            "dark"
                                                                 ? "#94A3B8"
                                                                 : "#9CA3AF"
                                                       }
                                                       keyboardType="phone-pad"
                                                       value={phone}
                                                       onChangeText={setPhone}
                                                  />
                                             </View>
                                        </View>
                                   </>
                              ) : step === 1 ? (
                                   <>
                                        <ThemedText
                                             type="defaultSemiBold"
                                             style={[
                                                  styles.title,
                                                  {color: textColor},
                                             ]}>
                                             Stay on top of everything
                                        </ThemedText>
                                        <ThemedText
                                             type="default"
                                             style={[
                                                  styles.subtitle,
                                                  {
                                                       color: textColor,
                                                       opacity: 0.7,
                                                  },
                                             ]}>
                                             Organize work, personal and study
                                             tasks in one clean, offline-first
                                             app. Priorities, due dates and
                                             filters keep you focused.
                                        </ThemedText>

                                        <View style={styles.bullets}>
                                             <View style={styles.bulletRow}>
                                                  <IconSymbol
                                                       name="checkmark.circle.fill"
                                                       size={18}
                                                       color={tintColor}
                                                  />
                                                  <ThemedText
                                                       type="default"
                                                       style={[
                                                            styles.bulletText,
                                                            {color: textColor},
                                                       ]}>
                                                       Fast task capture with
                                                       categories & priority
                                                  </ThemedText>
                                             </View>
                                             <View style={styles.bulletRow}>
                                                  <IconSymbol
                                                       name="chart.bar"
                                                       size={18}
                                                       color={tintColor}
                                                  />
                                                  <ThemedText
                                                       type="default"
                                                       style={[
                                                            styles.bulletText,
                                                            {color: textColor},
                                                       ]}>
                                                       Smart stats, filters and
                                                       search
                                                  </ThemedText>
                                             </View>
                                             <View style={styles.bulletRow}>
                                                  <IconSymbol
                                                       name="flag"
                                                       size={18}
                                                       color={tintColor}
                                                  />
                                                  <ThemedText
                                                       type="default"
                                                       style={[
                                                            styles.bulletText,
                                                            {color: textColor},
                                                       ]}>
                                                       Offline-first. Your data
                                                       stays on this device.
                                                  </ThemedText>
                                             </View>
                                        </View>
                                   </>
                              ) : (
                                   <>
                                        <ThemedText
                                             type="defaultSemiBold"
                                             style={[
                                                  styles.title,
                                                  {color: textColor},
                                             ]}>
                                             Pro-level gestures & quick actions
                                        </ThemedText>
                                        <ThemedText
                                             type="default"
                                             style={[
                                                  styles.subtitle,
                                                  {
                                                       color: textColor,
                                                       opacity: 0.7,
                                                  },
                                             ]}>
                                             Swipe tasks to complete or delete,
                                             long-press for more options, and
                                             batch-select when you want to move
                                             fast.
                                        </ThemedText>
                                   </>
                              )}

                              {/* Primary button */}
                              <TouchableOpacity
                                   style={[
                                        styles.primaryButton,
                                        {
                                             backgroundColor:
                                                  isProfileStep &&
                                                  (!name.trim() ||
                                                       !email.trim() ||
                                                       !phone.trim())
                                                       ? borderColor
                                                       : tintColor,
                                             shadowColor: tintColor,
                                        },
                                   ]}
                                   activeOpacity={0.85}
                                   disabled={
                                        isProfileStep &&
                                        (!name.trim() ||
                                             !email.trim() ||
                                             !phone.trim())
                                   }
                                   onPress={handleNext}>
                                   {saving ? (
                                        <ActivityIndicator
                                             size="small"
                                             color="#FFFFFF"
                                        />
                                   ) : (
                                        <ThemedText
                                             style={styles.primaryButtonText}>
                                             {primaryActionLabel}
                                        </ThemedText>
                                   )}
                              </TouchableOpacity>
                         </View>
                    </KeyboardAvoidingView>
               </SafeAreaView>
          </ThemedView>
     );
};

const styles = StyleSheet.create({
     topBar: {
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 4,
          alignItems: "flex-end",
     },
     skipText: {
          fontSize: 14,
          fontWeight: "600",
     },
     illustrationWrapper: {
          flex: 0.9,
          alignItems: "center",
          justifyContent: "flex-start",
     },
     illustrationContainer: {
          width: "100%",
          maxWidth: 480,
          height: 250,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          overflow: "hidden",
     },
     illustrationImage: {
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
     },
     illustrationOverlay: {
          width: "100%",
          height: "100%",
          paddingHorizontal: 24,
          paddingBottom: 18,
          justifyContent: "flex-end",
          alignItems: "flex-start",
     },
     illustrationInner: {
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
     },
     illustrationTitle: {
          marginTop: 12,
          fontSize: 20,
          fontWeight: "800",
          color: "#FFFFFF",
     },
     illustrationSubtitle: {
          marginTop: 4,
          fontSize: 13,
          color: "#F9FAFB",
          opacity: 0.9,
     },
     contentCard: {
          flex: 1.5,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderWidth: 1,
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 24,
          gap: 16,
     },
     dotsRow: {
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
          marginBottom: 4,
     },
     dot: {
          width: 8,
          height: 8,
          borderRadius: 4,
     },
     title: {
          fontSize: 20,
          fontWeight: "800",
          textAlign: "left",
     },
     subtitle: {
          fontSize: 14,
          lineHeight: 20,
          marginTop: 4,
     },
     form: {
          marginTop: 12,
          gap: 10,
     },
     field: {
          gap: 4,
     },
     fieldLabel: {
          fontSize: 13,
          fontWeight: "700",
          letterSpacing: 0.2,
     },
     input: {
          height: 44,
          borderWidth: 1.5,
          borderRadius: 12,
          paddingHorizontal: 12,
          fontSize: 15,
          fontWeight: "500",
     },
     bullets: {
          marginTop: 12,
          gap: 8,
     },
     bulletRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
     },
     bulletText: {
          fontSize: 14,
          flex: 1,
     },
     primaryButton: {
          marginTop: 16,
          borderRadius: 999,
          paddingVertical: 12,
          alignItems: "center",
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.24,
          shadowRadius: 8,
          elevation: 6,
     },
     primaryButtonText: {
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "700",
     },
});
