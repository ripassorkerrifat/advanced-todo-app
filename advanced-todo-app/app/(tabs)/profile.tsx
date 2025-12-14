/**
 * Profile Screen
 */

import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {Colors} from "@/constants/theme";
import {useProfile} from "@/store/ProfileContext";
import {useTheme} from "@/store/ThemeContext";
import React, {useEffect, useState} from "react";
import {
     Alert,
     Platform,
     ScrollView,
     StyleSheet,
     TextInput,
     TouchableOpacity,
     View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function ProfileScreen() {
     const {currentTheme} = useTheme();
     const {profile, updateProfile} = useProfile();
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [phone, setPhone] = useState("");
     const [isEditing, setIsEditing] = useState(false);

     useEffect(() => {
          if (profile) {
               setName(profile.name);
               setEmail(profile.email);
               setPhone(profile.phone);
          }
     }, [profile]);

     const handleSave = async () => {
          if (!name.trim() || !email.trim() || !phone.trim()) {
               Alert.alert("Error", "Please fill in all fields");
               return;
          }

          if (!email.includes("@")) {
               Alert.alert("Error", "Please enter a valid email address");
               return;
          }

          try {
               await updateProfile({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
               });
               setIsEditing(false);
               Alert.alert("Success", "Profile updated successfully");
          } catch (error) {
               console.error("Error updating profile:", error);
               Alert.alert("Error", "Failed to update profile");
          }
     };

     const backgroundColor =
          currentTheme === "dark"
               ? Colors.dark.background
               : Colors.light.background;
     const textColor =
          currentTheme === "dark" ? Colors.dark.text : Colors.light.text;
     const cardColor =
          currentTheme === "dark" ? Colors.dark.card : Colors.light.card;
     const borderColor =
          currentTheme === "dark" ? Colors.dark.border : Colors.light.border;
     const inputBackground = currentTheme === "dark" ? "#1E293B" : "#F9FAFB";

     return (
          <SafeAreaView
               style={[styles.container, {backgroundColor}]}
               edges={["top"]}>
               <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                         <ThemedText type="title" style={styles.title}>
                              Profile
                         </ThemedText>
                         {!isEditing && (
                              <TouchableOpacity
                                   onPress={() => setIsEditing(true)}
                                   style={[
                                        styles.editButton,
                                        {
                                             backgroundColor:
                                                  Colors[currentTheme].primary,
                                        },
                                   ]}>
                                   <IconSymbol
                                        name="pencil"
                                        size={20}
                                        color="#FFFFFF"
                                   />
                                   <ThemedText style={styles.editButtonText}>
                                        Edit
                                   </ThemedText>
                              </TouchableOpacity>
                         )}
                    </View>

                    {/* Profile Card */}
                    <View style={[styles.card, {backgroundColor: cardColor}]}>
                         {/* Avatar */}
                         <View
                              style={[
                                   styles.avatar,
                                   {
                                        backgroundColor:
                                             Colors[currentTheme].primary,
                                   },
                              ]}>
                              <ThemedText style={styles.avatarText}>
                                   {name
                                        ? name
                                               .split(" ")
                                               .map((n) => n[0])
                                               .join("")
                                               .toUpperCase()
                                               .slice(0, 2)
                                        : "U"}
                              </ThemedText>
                         </View>

                         {/* Form Fields */}
                         <View style={styles.form}>
                              <View style={styles.field}>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.label}>
                                        Name
                                   </ThemedText>
                                   <TextInput
                                        style={[
                                             styles.input,
                                             {
                                                  backgroundColor:
                                                       inputBackground,
                                                  color: textColor,
                                                  borderColor: borderColor,
                                             },
                                        ]}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Enter your name"
                                        placeholderTextColor={
                                             currentTheme === "dark"
                                                  ? "#64748B"
                                                  : "#9CA3AF"
                                        }
                                        editable={isEditing}
                                   />
                              </View>

                              <View style={styles.field}>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.label}>
                                        Email
                                   </ThemedText>
                                   <TextInput
                                        style={[
                                             styles.input,
                                             {
                                                  backgroundColor:
                                                       inputBackground,
                                                  color: textColor,
                                                  borderColor: borderColor,
                                             },
                                        ]}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Enter your email"
                                        placeholderTextColor={
                                             currentTheme === "dark"
                                                  ? "#64748B"
                                                  : "#9CA3AF"
                                        }
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={isEditing}
                                   />
                              </View>

                              <View style={styles.field}>
                                   <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.label}>
                                        Phone
                                   </ThemedText>
                                   <TextInput
                                        style={[
                                             styles.input,
                                             {
                                                  backgroundColor:
                                                       inputBackground,
                                                  color: textColor,
                                                  borderColor: borderColor,
                                             },
                                        ]}
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="Enter your phone"
                                        placeholderTextColor={
                                             currentTheme === "dark"
                                                  ? "#64748B"
                                                  : "#9CA3AF"
                                        }
                                        keyboardType="phone-pad"
                                        editable={isEditing}
                                   />
                              </View>

                              {isEditing && (
                                   <View style={styles.actions}>
                                        <TouchableOpacity
                                             onPress={() => {
                                                  setIsEditing(false);
                                                  if (profile) {
                                                       setName(profile.name);
                                                       setEmail(profile.email);
                                                       setPhone(profile.phone);
                                                  }
                                             }}
                                             style={[
                                                  styles.cancelButton,
                                                  {borderColor: borderColor},
                                             ]}>
                                             <ThemedText
                                                  style={{color: textColor}}>
                                                  Cancel
                                             </ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                             onPress={handleSave}
                                             style={[
                                                  styles.saveButton,
                                                  {
                                                       backgroundColor:
                                                            Colors[currentTheme]
                                                                 .primary,
                                                  },
                                             ]}>
                                             <ThemedText
                                                  style={styles.saveButtonText}>
                                                  Save
                                             </ThemedText>
                                        </TouchableOpacity>
                                   </View>
                              )}
                         </View>
                    </View>
               </ScrollView>
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     scrollView: {
          flex: 1,
     },
     content: {
          padding: 16,
     },
     header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingTop: Platform.OS === "ios" ? 0 : 20,
     },
     title: {
          fontSize: 32,
          fontWeight: "700",
     },
     editButton: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
     },
     editButtonText: {
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: "600",
     },
     card: {
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
     },
     avatar: {
          width: 100,
          height: 100,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
     },
     avatarText: {
          fontSize: 36,
          fontWeight: "700",
          color: "#FFFFFF",
     },
     form: {
          width: "100%",
          gap: 20,
     },
     field: {
          gap: 8,
     },
     label: {
          fontSize: 14,
          marginBottom: 4,
     },
     input: {
          height: 52,
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 16,
          fontSize: 16,
     },
     actions: {
          flexDirection: "row",
          gap: 12,
          marginTop: 8,
     },
     cancelButton: {
          flex: 1,
          height: 52,
          borderWidth: 1,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
     },
     saveButton: {
          flex: 1,
          height: 52,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
     },
     saveButtonText: {
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "600",
     },
});
