import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [profile, setProfile] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    bodyFat: '',
    experience: 'beginner',
    targetWeight: '',
    activityLevel: 'lightlyActive',
    selectedGoals: [],
    computedCalories: 0,
  });

  const updateProfile = (newData) => {
    setProfile((prev) => ({
      ...prev,
      ...newData
    }));
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);