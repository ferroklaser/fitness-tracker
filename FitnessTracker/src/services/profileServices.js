import { supabase } from "../lib/supabase";

// fetching user data
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq('user_id', userId)
        .single()
    
    if (error) {
        throw new Error(`Failed to get profile for ${userId}`, { cause : error })
    }

    return { data }
}

// creating and updating user data
export async function editUserProfile(userId, profileData) {
    const mappedData = {
        user_id: userId,
        gender: profileData.gender,
        experience: profileData.experience,
        activity_level: profileData.activityLevel,
        age: parseInt(profileData.age, 10),
        weight: parseFloat(profileData.weight),
        height: parseFloat(profileData.height),
        target_weight: parseFloat(profileData.targetWeight),
        body_fat: profileData.bodyFat ? parseFloat(profileData.bodyFat) : null,
        selected_goals: profileData.selectedGoals,
        computed_calories: parseInt(profileData.computedCalories, 10)
    }

    const { error } = await supabase
        .from("profiles")
        .upsert(mappedData)

    if (error) {
        throw new Error(`Failed to edit profile for ${userId}`, { cause : error })
    }
}

// Deletion handled by authentication deletion