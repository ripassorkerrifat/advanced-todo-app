import {Tabs} from "expo-router";
import React from "react";

import {HapticTab} from "@/components/haptic-tab";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";

export default function TabLayout() {
     const {currentTheme} = useTheme();

     return (
          <Tabs
               screenOptions={{
                    tabBarActiveTintColor: Colors[currentTheme].tint,
                    tabBarInactiveTintColor:
                         Colors[currentTheme].tabIconDefault,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarStyle: {
                         backgroundColor:
                              currentTheme === "dark"
                                   ? Colors.dark.card
                                   : Colors.light.card,
                         borderTopColor:
                              currentTheme === "dark"
                                   ? Colors.dark.border
                                   : Colors.light.border,
                    },
               }}>
               <Tabs.Screen
                    name="index"
                    options={{
                         title: "Home",
                         tabBarIcon: ({color}) => (
                              <IconSymbol
                                   size={28}
                                   name="house.fill"
                                   color={color}
                              />
                         ),
                    }}
               />
               <Tabs.Screen
                    name="profile"
                    options={{
                         title: "Profile",
                         tabBarIcon: ({color}) => (
                              <IconSymbol
                                   size={28}
                                   name="person.fill"
                                   color={color}
                              />
                         ),
                    }}
               />
               <Tabs.Screen
                    name="settings"
                    options={{
                         title: "Settings",
                         tabBarIcon: ({color}) => (
                              <IconSymbol
                                   size={28}
                                   name="gearshape.fill"
                                   color={color}
                              />
                         ),
                    }}
               />
          </Tabs>
     );
}
