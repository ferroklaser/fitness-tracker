import { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getWorkoutLogs } from "@/services/workoutServices";
import MyButton from "../../components/MyButton";
import { fetchAIInsights } from "../../util/fetchAIInsights";
import Markdown from "react-native-markdown-display";
import { BarChart } from "react-native-chart-kit";
import Svg, { Polyline, Line, Text as SvgText, Circle } from "react-native-svg";

const CHART_CONFIG = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => "#6B7280",
  strokeWidth: 2,
  barPercentage: 0.6,
  decimalPlaces: 0,
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#2563EB" },
};

function SimpleLineChart({ data, labels, width, height }) {
  const paddingLeft = 36;
  const paddingBottom = 28;
  const paddingTop = 12;
  const paddingRight = 12;
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingBottom - paddingTop;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((v, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartW;
    const y = paddingTop + chartH - ((v - minVal) / range) * chartH;
    return { x, y, v };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Pick ~4 y-axis labels
  const yTicks = [minVal, minVal + range * 0.5, maxVal].map(Math.round);

  return (
    <Svg width={width} height={height}>
      {/* Y-axis gridlines + labels */}
      {yTicks.map((tick) => {
        const y = paddingTop + chartH - ((tick - minVal) / range) * chartH;
        return (
          <Line
            key={tick}
            x1={paddingLeft}
            y1={y}
            x2={width - paddingRight}
            y2={y}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        );
      })}
      {yTicks.map((tick) => {
        const y = paddingTop + chartH - ((tick - minVal) / range) * chartH;
        return (
          <SvgText
            key={`lbl-${tick}`}
            x={paddingLeft - 4}
            y={y + 4}
            fontSize="10"
            fill="#9CA3AF"
            textAnchor="end"
          >
            {tick}
          </SvgText>
        );
      })}

      {/* Line */}
      <Polyline
        points={polylinePoints}
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Dots + x-labels */}
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563EB" />
      ))}
      {labels.map((label, i) => {
        const x = paddingLeft + (i / (data.length - 1)) * chartW;
        return (
          <SvgText
            key={`x-${i}`}
            x={x}
            y={height - 6}
            fontSize="9"
            fill="#9CA3AF"
            textAnchor="middle"
          >
            {label}
          </SvgText>
        );
      })}
    </Svg>
  );
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
}

function formatDayLabel(date) {
  return date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// --- chart data builders ---

function buildWeeklySessionsData(logs) {
  const days = getLast7Days();
  // Count unique sessions per day
  const counts = days.map((day) => {
    const dayLogs = logs.filter((l) => isSameDay(new Date(l.created_at), day));
    return new Set(dayLogs.map((l) => l.session_id)).size;
  });
  return {
    labels: days.map(formatDayLabel),
    datasets: [{ data: counts }],
  };
}

// Max weight lifted per session for a given exercise (last 10 sessions)
function buildMaxWeightProgressData(logs, exerciseName) {
  const filtered = logs.filter((l) => l.exercise_name === exerciseName);

  // Group by session_id, take max weight per session
  const bySession = {};
  filtered.forEach((l) => {
    const key = l.session_id;
    if (!bySession[key] || l.weight > bySession[key].weight) {
      bySession[key] = l;
    }
  });

  const sessions = Object.values(bySession)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(-10);

  if (sessions.length < 2) return null;

  return {
    labels: sessions.map((l) =>
      new Date(l.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [{ data: sessions.map((l) => Number(l.weight)) }],
  };
}

// --- component ---

export default function Insights() {
  const { user } = useAuth();
  const { width: windowWidth } = useWindowDimensions();
  const CHART_WIDTH = windowWidth - 80; // card padding (20 outer + 18 inner) × 2

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [remainingReq, setRemainingReq] = useState(null);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      if (user?.id) {
        const { data, error } = await getWorkoutLogs(user.id);
        if (!error && data) {
          setLogs(data);
        }
      }
    };
    fetchWorkoutLogs();
  }, [user?.id]);

  // Derived stats
  const startOfWeek = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const workoutsThisWeek = useMemo(
    () => logs.filter((log) => new Date(log.created_at) >= startOfWeek),
    [logs, startOfWeek]
  );

  const uniqueSessionsThisWeek = useMemo(
    () => new Set(workoutsThisWeek.map((log) => log.session_id)).size,
    [workoutsThisWeek]
  );

  const mostRecentWorkout = logs.length > 0 ? logs[0].exercise_name : "None";

  // Top 5 most frequently logged exercises for the picker
  const exerciseNames = useMemo(() => {
    const freq = {};
    logs.forEach((l) => {
      freq[l.exercise_name] = (freq[l.exercise_name] || 0) + 1;
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }, [logs]);

  // Auto-select first exercise
  useEffect(() => {
    if (exerciseNames.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseNames[0]);
    }
  }, [exerciseNames, selectedExercise]);

  const weeklySessionsData = useMemo(() => buildWeeklySessionsData(logs), [logs]);
  const weightProgressData = useMemo(
    () => (selectedExercise ? buildMaxWeightProgressData(logs, selectedExercise) : null),
    [logs, selectedExercise]
  );

  const handleGenerateReport = async () => {
    setLoading(true);
    setReport(null);
    setError(null);

    try {
      const data = await fetchAIInsights();
      setReport(data.report);
      setRemainingReq(data.remaining_requests);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const hasSessionData = weeklySessionsData.datasets[0].data.some((v) => v > 0);
  const maxSessions = Math.max(...weeklySessionsData.datasets[0].data, 1);
  const sessionSegments = Math.min(maxSessions, 5);

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
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
            {mostRecentWorkout}
          </Text>
          <Text style={styles.statLabel}>Most Recent</Text>
          <Text style={styles.statSubLabel}>Workout</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{logs.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statSubLabel}>Logged Sets</Text>
        </View>
      </View>

      {/* Weekly Sessions Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Workout Frequency</Text>
        <Text style={styles.cardSubtitle}>
          Sessions logged per day — last 7 days
        </Text>
        {hasSessionData ? (
          <BarChart
            data={weeklySessionsData}
            width={CHART_WIDTH}
            height={180}
            chartConfig={CHART_CONFIG}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
            withInnerLines={false}
            segments={sessionSegments}
          />
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>
              No workouts logged in the last 7 days.
            </Text>
          </View>
        )}
      </View>

      {/* Max Weight Progress Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Strength Progress</Text>
        <Text style={styles.cardSubtitle}>
          Max weight lifted per session — top 5 most logged exercises
        </Text>

        {/* Exercise picker */}
        {exerciseNames.length > 0 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pickerRow}
            >
              {exerciseNames.map((name) => (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.pill,
                    selectedExercise === name && styles.pillActive,
                  ]}
                  onPress={() => setSelectedExercise(name)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      selectedExercise === name && styles.pillTextActive,
                    ]}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {weightProgressData ? (
              <SimpleLineChart
                data={weightProgressData.datasets[0].data}
                labels={weightProgressData.labels}
                width={CHART_WIDTH}
                height={180}
              />
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>
                  Need at least 2 sessions of {selectedExercise} to show a trend.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>
              No exercises logged yet. Start tracking to see your progress.
            </Text>
          </View>
        )}
      </View>

      {/* AI Report */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Progress Report</Text>
        <Text style={styles.cardSubtitle}>
          Generate a personalized summary based on your workout history.
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <MyButton
          title={loading ? "Generating Report..." : "Generate AI Progress Report"}
          onPress={handleGenerateReport}
        />

        {remainingReq !== null && (
          <Text style={styles.remainingText}>
            {remainingReq} AI reports remaining today
          </Text>
        )}

        {loading && (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}

        {report && (
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>AI Coach Summary</Text>
            <Markdown>{report}</Markdown>
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 14,
  },
  chart: {
    borderRadius: 12,
    marginTop: 4,
  },
  emptyChart: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  emptyChartText: {
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  pickerRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
    backgroundColor: "#F9FAFB",
  },
  pillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  pillText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  pillTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  errorContainer: {
    marginBottom: 12,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
  },
  remainingText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
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
});
