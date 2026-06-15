import { supabase } from "../lib/supabase";

// Fetch user profile — returns null if no profile exists yet (new user)
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq('user_id', userId)
        .single();

    // PGRST116 = no rows found — not a real error, just a new user
    if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to get profile for ${userId}`, { cause: error });
    }

    return { data: data ?? null };
}

// Create or update user profile
export async function editUserProfile(userId, profileData) {
    const mappedData = {
        user_id: userId,
        gender: profileData.gender,
        experience: profileData.experience,
        activitylevel: profileData.activityLevel,
        age: parseInt(profileData.age, 10),
        weight: parseFloat(profileData.weight),
        height: parseFloat(profileData.height),
        targetweight: parseFloat(profileData.targetWeight),
        bodyfat: profileData.bodyFat ? parseFloat(profileData.bodyFat) : null,
        selectedgoals: profileData.selectedGoals,
        computedcalories: parseInt(profileData.computedCalories, 10),
    };

    const { error } = await supabase
        .from("profiles")
        .upsert(mappedData, { onConflict: 'user_id' });

    // if (error) {
    //     throw new Error(`Failed to edit profile for ${userId}`, { cause: error });
    // }
        if (error) {
        throw new Error(
            `Failed to edit profile for ${userId}: ${error.message}`
        )
    }
}

// Deletion handled by authentication deletion