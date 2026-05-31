// Read all workout records

// Read a single workout record

// Edit a single workout record

// Insert a new workout record

// Delete a workout record

import { supabase } from "../lib/supabase";

// Read all workout records for a user
export async function getWorkoutLogs(userId) {
  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

// Read a single workout record
export async function getWorkoutLog(id) {
  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

// Insert a new workout record
export async function createWorkoutLog(workoutLog) {
  const { data, error } = await supabase
    .from("workout_logs")
    .insert([workoutLog])
    .select();

  return { data, error };
}

// Edit a single workout record
export async function updateWorkoutLog(id, updates) {
  const { data, error } = await supabase
    .from("workout_logs")
    .update(updates)
    .eq("id", id)
    .select();

  return { data, error };
}

// Delete a workout record
export async function deleteWorkoutLog(id) {
  const { data, error } = await supabase
    .from("workout_logs")
    .delete()
    .eq("id", id)
    .select();

  return { data, error };
}