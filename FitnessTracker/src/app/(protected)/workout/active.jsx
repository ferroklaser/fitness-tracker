import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  createWorkoutSession,
  createWorkoutLog,
} from "@/services/workoutServices";

export default function ActiveWorkoutRoom() {
  const router = useRouter();
  const { user } = useAuth();

  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const [sessionId, setSessionId] = useState(null);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [addHovered, setAddHovered] = useState(false);
  const [finishHovered, setFinishHovered] = useState(false);

  const handleLogSet = async () => {
    console.log("Pin button clicked");
    console.log("Current user:", user);
    if (!exercise || !sets || !reps || !weight) {
      Alert.alert(
        "Missing Fields",
        "Please populate all measurement rows before pinning your set."
      );
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    setSaving(true);

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const { data: sessionData, error: sessionError } =
        await createWorkoutSession(user.id);

        console.log("Session data:", sessionData);
        console.log("Session error:", sessionError);

      if (sessionError) {
        setSaving(false);
        Alert.alert("Error", sessionError.message);
        return;
      }

      currentSessionId = sessionData.id;
      setSessionId(currentSessionId);
    }

    const workoutLog = {
      session_id: currentSessionId,
      user_id: user.id,
      exercise_name: exercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      rest_time_seconds: null,
    };

    const { data, error } = await createWorkoutLog(workoutLog);

    console.log("Workout log data:", data);
    console.log("Workout log error:", error);

    setSaving(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    const savedLog = data?.[0];

    const newLog = {
      id: savedLog?.id ?? Date.now(),
      name: exercise,
      details: `${sets} sets × ${reps} reps × ${weight} kg`,
    };

    setSessionLogs([newLog, ...sessionLogs]);

    setSets("");
    setReps("");
    setWeight("");
  };

  const handleFinishWorkout = () => {
    router.replace("/?toast=workout_saved");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backLink} onPress={() => router.replace("/")}>
        <Text style={styles.backLinkText}>← Cancel Workout Session</Text>
      </TouchableOpacity>

      {/* Changed header title text below */}
      <Text style={styles.headerTitle}>Quick Log</Text>

      <View style={styles.loggerCard}>
        <Text style={styles.loggerLabel}>Active Set Entry</Text>

        <TextInput
          style={styles.inputField}
          placeholder="Exercise Name (e.g., Squat)"
          value={exercise}
          onChangeText={setExercise}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.inputField, { flex: 1, marginRight: 6 }]}
            placeholder="Sets"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
          />
          <TextInput
            style={[styles.inputField, { flex: 1, marginRight: 6 }]}
            placeholder="Reps"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
          <TextInput
            style={[styles.inputField, { flex: 1 }]}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitLogButton, addHovered && styles.submitLogButtonHover]}
          onPress={handleLogSet}
          disabled={saving}
          onMouseEnter={() => setAddHovered(true)}
          onMouseLeave={() => setAddHovered(false)}
        >
          <Text style={styles.submitLogButtonText}>
            {saving ? "Saving..." : "Add into Session"}
          </Text>
        </TouchableOpacity>
      </View>

      {sessionLogs.length > 0 && (
        <TouchableOpacity
          style={[styles.finishWorkoutButton, finishHovered && styles.finishWorkoutButtonHover]}
          onPress={handleFinishWorkout}
          onMouseEnter={() => setFinishHovered(true)}
          onMouseLeave={() => setFinishHovered(false)}
        >
          <Text style={styles.finishWorkoutButtonText}>
            Save & Finish Workout Session
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>
        Active Session Feed ({sessionLogs.length})
      </Text>

      {sessionLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No training sets tracked in this session window yet.
          </Text>
        </View>
      ) : (
        sessionLogs.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDetails}>{item.details}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#FAFAFA", padding: 20, paddingTop: 24 },
  backLink: { alignSelf: "flex-start", paddingVertical: 4, marginBottom: 12 },
  backLinkText: { color: "#EF4444", fontSize: 13, fontWeight: "700" },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#111111", marginBottom: 20 }, // Added marginBottom here since subtitle is gone
  subtitle: { fontSize: 13, color: "#888888", marginTop: 4, marginBottom: 20, lineHeight: 18 },

  loggerCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "#EAEAEA", marginBottom: 16 },
  loggerLabel: { fontSize: 11, fontWeight: "800", color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  inputField: { backgroundColor: "#F9F9F9", borderWidth: 1, borderColor: "#EAEAEA", borderRadius: 8, padding: 12, fontSize: 14, color: "#111", marginBottom: 10 },
  inputRow: { flexDirection: "row", marginBottom: 4 },
  submitLogButton: { backgroundColor: "#2563EB", borderWidth: 1, borderColor: "#1D4ED8", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 4 },
  submitLogButtonHover: { backgroundColor: "#5574d3ff" },
  submitLogButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },

  finishWorkoutButton: { backgroundColor: "#111111", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  finishWorkoutButtonHover: { backgroundColor: "#374151" },
  finishWorkoutButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },

  sectionTitle: { fontSize: 11, fontWeight: "800", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, paddingLeft: 4 },
  emptyContainer: { padding: 32, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#EAEAEA" },
  emptyText: { color: "#999", fontSize: 13, textAlign: "center" },
  historyItem: { backgroundColor: "#FFF", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#EAEAEA", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  itemTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  itemDetails: { fontSize: 13, color: "#666", fontWeight: "500" },
});