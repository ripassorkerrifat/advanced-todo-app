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
          } else {
               // If no profile exists, allow editing immediately
               setIsEditing(true);
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

     const handleCancel = () => {
          setIsEditing(false);
          if (profile) {
               setName(profile.name);
               setEmail(profile.email);
               setPhone(profile.phone);
          } else {
               setName("");
               setEmail("");
               setPhone("");
          }
     };

     const backgroundColor = Colors[currentTheme].background;
     const textColor = Colors[currentTheme].text;
     const cardColor = Colors[currentTheme].card;
     const borderColor = Colors[currentTheme].border;
     const tintColor = Colors[currentTheme].tint;

     const initials = name
          ? name
                 .split(" ")
                 .map((n) => n[0])
                 .join("")
                 .toUpperCase()
                 .slice(0, 2)
          : "U";

     return (
          <SafeAreaView
               style={[styles.container, {backgroundColor}]}
               edges={["top"]}>
               {/* Fixed Header */}
               <View
                    style={[
                         styles.header,
                         {
                              backgroundColor: backgroundColor,
                              borderBottomColor: borderColor,
                         },
                    ]}>
                    <View style={styles.titleSection}>
                         <ThemedText type="title" style={styles.title}>
                              Profile
                         </ThemedText>
                         <ThemedText
                              type="default"
                              style={[styles.subtitle, {opacity: 0.6}]}>
                              Manage your information
                         </ThemedText>
                    </View>
                    {!isEditing && profile && (
                         <TouchableOpacity
                              onPress={() => setIsEditing(true)}
                              style={[
                                   styles.editButton,
                                   {backgroundColor: tintColor + "20"},
                              ]}
                              activeOpacity={0.7}>
                              <IconSymbol
                                   name="pencil"
                                   size={16}
                                   color={tintColor}
                              />
                         </TouchableOpacity>
                    )}
               </View>

               <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}>
                    {/* Avatar Section */}
                    <View
                         style={[
                              styles.avatarCard,
                              {backgroundColor: cardColor},
                         ]}>
                         <View
                              style={[
                                   styles.avatarContainer,
                                   {
                                        backgroundColor: tintColor + "20",
                                   },
                              ]}>
                              <View
                                   style={[
                                        styles.avatar,
                                        {backgroundColor: tintColor},
                                   ]}>
                                   <ThemedText style={styles.avatarText}>
                                        {initials}
                                   </ThemedText>
                              </View>
                         </View>
                         <ThemedText
                              type="defaultSemiBold"
                              style={styles.avatarName}>
                              {name || "Your Name"}
                         </ThemedText>
                         <ThemedText
                              type="default"
                              style={[styles.avatarEmail, {opacity: 0.6}]}>
                              {email || "your.email@example.com"}
                         </ThemedText>
                    </View>

                    {/* Name Section */}
                    <View
                         style={[
                              styles.formCard,
                              {backgroundColor: cardColor},
                         ]}>
                         <View style={styles.sectionHeader}>
                              <View
                                   style={[
                                        styles.iconBadge,
                                        {backgroundColor: tintColor + "20"},
                                   ]}>
                                   <IconSymbol
                                        name="person.fill"
                                        size={16}
                                        color={tintColor}
                                   />
                              </View>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={styles.label}>
                                   Full Name
                              </ThemedText>
                         </View>
                         <TextInput
                              style={[
                                   styles.input,
                                   {
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        borderColor,
                                   },
                              ]}
                              value={name}
                              onChangeText={setName}
                              placeholder="Enter your full name"
                              placeholderTextColor={
                                   currentTheme === "dark"
                                        ? "#94A3B8"
                                        : "#9CA3AF"
                              }
                              editable={isEditing}
                         />
                    </View>

                    {/* Email Section */}
                    <View
                         style={[
                              styles.formCard,
                              {backgroundColor: cardColor},
                         ]}>
                         <View style={styles.sectionHeader}>
                              <View
                                   style={[
                                        styles.iconBadge,
                                        {backgroundColor: tintColor + "20"},
                                   ]}>
                                   <IconSymbol
                                        name="envelope"
                                        size={16}
                                        color={tintColor}
                                   />
                              </View>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={styles.label}>
                                   Email Address
                              </ThemedText>
                         </View>
                         <TextInput
                              style={[
                                   styles.input,
                                   {
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        borderColor,
                                   },
                              ]}
                              value={email}
                              onChangeText={setEmail}
                              placeholder="Enter your email"
                              placeholderTextColor={
                                   currentTheme === "dark"
                                        ? "#94A3B8"
                                        : "#9CA3AF"
                              }
                              keyboardType="email-address"
                              autoCapitalize="none"
                              editable={isEditing}
                         />
                    </View>

                    {/* Phone Section */}
                    <View
                         style={[
                              styles.formCard,
                              {backgroundColor: cardColor},
                         ]}>
                         <View style={styles.sectionHeader}>
                              <View
                                   style={[
                                        styles.iconBadge,
                                        {backgroundColor: tintColor + "20"},
                                   ]}>
                                   <IconSymbol
                                        name="phone"
                                        size={16}
                                        color={tintColor}
                                   />
                              </View>
                              <ThemedText
                                   type="defaultSemiBold"
                                   style={styles.label}>
                                   Phone Number
                              </ThemedText>
                         </View>
                         <TextInput
                              style={[
                                   styles.input,
                                   {
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        borderColor,
                                   },
                              ]}
                              value={phone}
                              onChangeText={setPhone}
                              placeholder="Enter your phone number"
                              placeholderTextColor={
                                   currentTheme === "dark"
                                        ? "#94A3B8"
                                        : "#9CA3AF"
                              }
                              keyboardType="phone-pad"
                              editable={isEditing}
                         />
                    </View>

                    {/* Action Buttons */}
                    {isEditing && (
                         <View style={styles.actions}>
                              <TouchableOpacity
                                   onPress={handleCancel}
                                   activeOpacity={0.7}
                                   style={[
                                        styles.cancelButton,
                                        {
                                             backgroundColor: "transparent",
                                             borderColor,
                                        },
                                   ]}>
                                   <ThemedText
                                        style={[styles.cancelButtonText]}>
                                        Cancel
                                   </ThemedText>
                              </TouchableOpacity>
                              <TouchableOpacity
                                   onPress={handleSave}
                                   activeOpacity={0.8}
                                   style={[
                                        styles.saveButton,
                                        {
                                             backgroundColor: tintColor,
                                             shadowColor: tintColor,
                                        },
                                   ]}>
                                   <IconSymbol
                                        name="checkmark.circle.fill"
                                        size={18}
                                        color="#FFFFFF"
                                        style={styles.saveIcon}
                                   />
                                   <ThemedText style={styles.saveButtonText}>
                                        Save Changes
                                   </ThemedText>
                              </TouchableOpacity>
                         </View>
                    )}
               </ScrollView>
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
     },
     titleSection: {
          flex: 1,
     },
     title: {
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 2,
     },
     subtitle: {
          fontSize: 13,
     },
     editButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          justifyContent: "center",
          alignItems: "center",
     },
     scrollView: {
          flex: 1,
     },
     content: {
          padding: 20,
          paddingBottom: 40,
     },
     avatarCard: {
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "transparent",
     },
     avatarContainer: {
          width: 120,
          height: 120,
          borderRadius: 60,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
     },
     avatar: {
          width: 100,
          height: 100,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
     },
     avatarText: {
          fontSize: 40,
          fontWeight: "800",
          color: "#FFFFFF",
     },
     avatarName: {
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 4,
     },
     avatarEmail: {
          fontSize: 14,
     },
     formCard: {
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "transparent",
     },
     sectionHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          gap: 10,
     },
     iconBadge: {
          width: 28,
          height: 28,
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
     },
     label: {
          fontSize: 14,
          fontWeight: "700",
          letterSpacing: 0.2,
     },
     input: {
          height: 50,
          borderWidth: 1.5,
          borderRadius: 12,
          paddingHorizontal: 16,
          fontSize: 16,
          fontWeight: "500",
     },
     actions: {
          flexDirection: "row",
          gap: 12,
          marginTop: 8,
     },
     cancelButton: {
          flex: 1,
          height: 56,
          borderWidth: 1.5,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
     },
     cancelButtonText: {
          fontSize: 16,
          fontWeight: "600",
     },
     saveButton: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 56,
          borderRadius: 16,
          gap: 8,
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
     },
     saveIcon: {
          marginRight: 2,
     },
     saveButtonText: {
          color: "#FFFFFF",
          fontSize: 17,
          fontWeight: "700",
          letterSpacing: 0.3,
     },
});
