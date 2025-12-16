import {
     DarkTheme,
     DefaultTheme,
     ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import "react-native-reanimated";
import {SafeAreaProvider} from "react-native-safe-area-context";
import "../global.css";

import {OnboardingGate} from "@/components/onboarding/OnboardingGate";
import {BiometricGate} from "@/components/security/BiometricGate";
import {ProfileProvider} from "@/store/ProfileContext";
import {TaskProvider} from "@/store/TaskContext";
import {ThemeProvider, useTheme} from "@/store/ThemeContext";

export const unstable_settings = {
     anchor: "(tabs)",
};

function AppContent() {
     const {currentTheme} = useTheme();

     return (
          <NavThemeProvider
               value={currentTheme === "dark" ? DarkTheme : DefaultTheme}>
               <BiometricGate>
                    <OnboardingGate>
                         <Stack>
                              <Stack.Screen
                                   name="(tabs)"
                                   options={{headerShown: false}}
                              />
                              <Stack.Screen
                                   name="add-task"
                                   options={{
                                        presentation: "modal",
                                        headerShown: false,
                                   }}
                              />
                              <Stack.Screen
                                   name="edit-task"
                                   options={{
                                        presentation: "modal",
                                        headerShown: false,
                                   }}
                              />
                              <Stack.Screen
                                   name="modal"
                                   options={{
                                        presentation: "modal",
                                        title: "Modal",
                                   }}
                              />
                         </Stack>
                    </OnboardingGate>
               </BiometricGate>
               <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
          </NavThemeProvider>
     );
}

export default function RootLayout() {
     return (
          <SafeAreaProvider>
               <GestureHandlerRootView style={{flex: 1}}>
                    <ThemeProvider>
                         <ProfileProvider>
                              <TaskProvider>
                                   <AppContent />
                              </TaskProvider>
                         </ProfileProvider>
                    </ThemeProvider>
               </GestureHandlerRootView>
          </SafeAreaProvider>
     );
}
