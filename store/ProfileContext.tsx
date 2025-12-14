/**
 * Profile Context for user profile management
 */

import * as profileStorage from "@/services/profileStorage";
import {Profile} from "@/types/profile";
import React, {
     createContext,
     useCallback,
     useContext,
     useEffect,
     useState,
} from "react";

interface ProfileContextType {
     profile: Profile | null;
     isLoading: boolean;
     updateProfile: (profile: Profile) => Promise<void>;
     loadProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{children: React.ReactNode}> = ({
     children,
}) => {
     const [profile, setProfile] = useState<Profile | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     // Load profile on mount
     useEffect(() => {
          loadProfile();
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

     const loadProfile = useCallback(async () => {
          try {
               setIsLoading(true);
               const loaded = await profileStorage.loadProfile();
               setProfile(loaded);
          } catch (error) {
               console.error("Error loading profile:", error);
          } finally {
               setIsLoading(false);
          }
     }, []);

     const updateProfile = useCallback(async (newProfile: Profile) => {
          try {
               await profileStorage.saveProfile(newProfile);
               setProfile(newProfile);
          } catch (error) {
               console.error("Error updating profile:", error);
               throw error;
          }
     }, []);

     const value: ProfileContextType = {
          profile,
          isLoading,
          updateProfile,
          loadProfile,
     };

     return (
          <ProfileContext.Provider value={value}>
               {children}
          </ProfileContext.Provider>
     );
};

export const useProfile = (): ProfileContextType => {
     const context = useContext(ProfileContext);
     if (context === undefined) {
          throw new Error("useProfile must be used within a ProfileProvider");
     }
     return context;
};
