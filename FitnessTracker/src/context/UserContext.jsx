import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { editUserProfile, getUserProfile } from '../services/profileServices'
import { DEFAULT_PROFILE } from '@/constants/profile';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useAuth()
  // Inside your UserProvider...

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);


  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) {
        // No user? Reset the profile to defaults and stop loading
        setProfile(DEFAULT_PROFILE);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Remember your function returns { data }
        const { data } = await getUserProfile(user.id);

        if (data) {
          // Map the database fields back to your camelCase React state fields if necessary
          setProfile({
            gender: data.gender,
            age: data.age || '',
            weight: data.weight || '',
            height: data.height || '',
            bodyFat: data.body_fat || '',
            experience: data.experience,
            targetWeight: data.target_weight || '',
            activityLevel: data.activity_level,
            selectedGoals: data.selected_goals || [],
            computedCalories: data.computed_calories || 0,
          });
        } else {
          setProfile(DEFAULT_PROFILE);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]); // <-- Re-run this effect whenever the user logs in or out

  const updateProfile = async (newData) => {
    const updatedProfile = {
      ...profile,
      ...newData
    }
    setProfile(updatedProfile);
    try {
      await editUserProfile(user.id, updatedProfile)
    } catch (error) {
      console.error("Error updating user profile:", error)
    }
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);