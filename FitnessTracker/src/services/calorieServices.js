// Read all calorie records

// Read a single calorie record

// Edit a single calorie record

// Insert a new calorie record

// Delete a calorie record

import { supabase } from "../lib/supabase";

// Read all calorie records for a user
export async function getCalorieLogs(userId) {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

// Read a single calorie record
export async function getCalorieLog(id) {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

// Insert a new calorie record
export async function createCalorieLog(calorieLog) {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .insert([calorieLog])
    .select();

  return { data, error };
}

// Edit a single calorie record
export async function updateCalorieLog(id, updates) {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .update(updates)
    .eq("id", id)
    .select();

  return { data, error };
}

// Delete a calorie record
export async function deleteCalorieLog(id) {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .delete()
    .eq("id", id)
    .select();

  return { data, error };
}