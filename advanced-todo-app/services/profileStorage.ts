/**
 * Profile storage service for user profile data
 */

import {Profile} from "@/types/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@todo_app:profile";

/**
 * Load profile from storage
 */
export const loadProfile = async (): Promise<Profile | null> => {
     try {
          const data = await AsyncStorage.getItem(STORAGE_KEY);
          if (data) {
               return JSON.parse(data) as Profile;
          }
          return null;
     } catch (error) {
          console.error("Error loading profile:", error);
          return null;
     }
};

/**
 * Save profile to storage
 */
export const saveProfile = async (profile: Profile): Promise<void> => {
     try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
     } catch (error) {
          console.error("Error saving profile:", error);
          throw error;
     }
};

/**
 * Clear profile data
 */
export const clearProfile = async (): Promise<void> => {
     await AsyncStorage.removeItem(STORAGE_KEY);
};
