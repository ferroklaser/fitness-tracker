import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getWorkoutLogs } from "@/services/workoutServices";
import MyButton from "../../components/MyButton";
import { fetchAIInsights } from "../../util/fetchAIInsights";

export default function Insights() {
  const { user } = useAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [remainingReq, setRemainingReq] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      if (user?.id) {
        const { data, error } = await getWorkoutLogs(user.id);

        if (!error) {
          setLogs(data);
        }
      }
    };

    fetchWorkoutLogs();
  }, [user?.id]);

// Workout sessions this week
const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

const workoutsThisWeek = logs.filter(
  (log) => new Date(log.created_at) >= startOfWeek
);

// Count unique sessions
const uniqueSessionsThisWeek = new Set(
  workoutsThisWeek.map((log) => log.session_id)
).size;

// Most recent workout
const mostRecentWorkout =
  logs.length > 0 ? logs[0].exercise_name : "None";

// Placeholder streak
const currentStreak = 3;

  const handleGenerateReport = async () => {
    setLoading(true);
    setReport(null);

    try {
      const data = await fetchAIInsights()
      setReport(data.report)
      setRemainingReq(data.remainingReq)
    } catch (err) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.backButton} onPress={() => router.push("/")}>
        ← Dashboard
      </Text>

      <Text style={styles.headerTitle}>Insights</Text>
      <Text style={styles.subtitle}>
        Track your progress and receive AI-powered recommendations.
      </Text>

      <Text style={styles.sectionTitle}>Performance Summary</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{uniqueSessionsThisWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
          <Text style={styles.statSubLabel}>Workout Sessions</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{mostRecentWorkout}</Text>
          <Text style={styles.statLabel}>Most Recent</Text>
          <Text style={styles.statSubLabel}>Workout</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
          <Text style={styles.statSubLabel}>Consistency</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Consistency</Text>

        <View style={styles.streakContainer}>
          <Text style={styles.streakEmoji}>🔥</Text>

          <View>
            <Text style={styles.streakTitle}>3-Day Streak</Text>
            <Text style={styles.streakText}>
              You have logged activity for 3 consecutive days.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Progress Report</Text>
        <Text style={styles.cardSubtitle}>
          Generate a personalized summary based on your workout history.
        </Text>

        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>

        <MyButton
          title={loading ? "Generating Report..." : "Generate AI Progress Report"}
          onPress={handleGenerateReport}
        />

        {loading && (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}

        {report && (
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>AI Coach Summary</Text>
            <Text style={styles.reportText}>{report}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    paddingBottom: 40,
  },

  backButton: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    textAlign: "center",
  },

  statSubLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },

  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  streakEmoji: {
    fontSize: 32,
    marginRight: 12,
  },

  streakTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  streakText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  spinner: {
    marginTop: 18,
    alignItems: "center",
  },

  reportCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  reportTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 8,
  },

  reportText: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },
});