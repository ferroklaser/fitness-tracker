import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function Insights() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleGenerateReport = () => {
    setLoading(true); setReport(null);
    setTimeout(() => {
      setLoading(false);
      setReport(
        "💪 AI Coaching Feedback:\n\n" +
        "You have successfully maintained progressive overload targets for consecutive Squat rotations. Consider increasing your working set load by 2.5 kg next session.\n\n" +
        "⚠️ Nutrition Baseline Check: Data analysis tracks a structural calorie deficit window over your last entry baseline log. Ensure recovery thresholds are met."
      );
    }, 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>AI Coach</Text>
      <Text style={styles.subtitle}>Process telemetry workout history logs to unlock specific progression suggestions.</Text>

      <TouchableOpacity style={styles.mainButton} onPress={handleGenerateReport} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Analyzing Database History..." : "Generate AI Progress Report"}</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}><ActivityIndicator size="small" color="#111" /></View>
      )}

      {report && (
        <View style={styles.insightBox}>
          <Text style={styles.boxTitle}>✨ Evaluation Output</Text>
          <Text style={styles.boxContent}>{report}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingTop: 32 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 24, lineHeight: 18 },
  mainButton: { backgroundColor: '#111', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  loadingContainer: { marginTop: 32, alignItems: 'center' },
  insightBox: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginTop: 24, borderWidth: 1, borderColor: '#EAEAEA' },
  boxTitle: { fontSize: 11, fontWeight: '800', color: '#007AFF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  boxContent: { color: '#111', fontSize: 13, lineHeight: 20, fontWeight: '500' }
});