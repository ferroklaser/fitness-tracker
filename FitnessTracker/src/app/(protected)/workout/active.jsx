import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function ActiveWorkoutRoom() {
  const router = useRouter();

  // --- Isolated Frontend Form States ---
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  
  const [sessionLogs, setSessionLogs] = useState([]);

  const handleLogSet = () => {
    if (!exercise || !sets || !reps || !weight) {
      Alert.alert("Missing Fields", "Please populate all measurement rows before pinning your set.");
      return;
    }

    const newLog = {
      id: Date.now(),
      name: exercise,
      details: `${sets} sets × ${reps} reps × ${weight} kg`
    };

    setSessionLogs([newLog, ...sessionLogs]);
    
    // Auto-clear variable loops while retaining exercise context name for quick typing
    setSets('');
    setReps('');
    setWeight('');
  };

  const handleFinishWorkout = () => {
    Alert.alert(
      "🎉 Workout Complete!", 
      `Excellent session! You successfully saved ${sessionLogs.length} exercises to today's catalog stream.`,
      [{ text: "Complete", onPress: () => router.replace('/') }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 🧭 Header Escape Anchor */}
      <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/')}>
        <Text style={styles.backLinkText}>← Cancel Workout Session</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Live Workout Room</Text>
      <Text style={styles.subtitle}>Perform your sets and add metrics in real time to compile your telemetry ledger.</Text>

      {/* 📝 Shifted Core Entry Form Logger */}
      <View style={styles.loggerCard}>
        <Text style={styles.loggerLabel}>Active Set Entry</Text>
        
        <TextInput 
          style={styles.inputField} 
          placeholder="Exercise Name (e.g., Squat)" 
          value={exercise}
          onChangeText={setExercise}
        />
        
        {/* Your Perfect Horizontal Ordering Sequence Flow */}
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

        <TouchableOpacity style={styles.submitLogButton} onPress={handleLogSet}>
          <Text style={styles.submitLogButtonText}>Pin Set into Session</Text>
        </TouchableOpacity>
      </View>

      {/* 🏁 Complete Session Floating Control Action */}
      {sessionLogs.length > 0 && (
        <TouchableOpacity style={styles.finishWorkoutButton} onPress={handleFinishWorkout}>
          <Text style={styles.finishWorkoutButtonText}>Save & Finish Workout Session</Text>
        </TouchableOpacity>
      )}

      {/* 📋 Live Session Ledger Tracking Feed */}
      <Text style={styles.sectionTitle}>Active Session Feed ({sessionLogs.length})</Text>
      
      {sessionLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No training sets tracked in this session window yet.</Text>
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
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingTop: 24 },
  backLink: { alignSelf: 'flex-start', paddingVertical: 4, marginBottom: 12 },
  backLinkText: { color: '#EF4444', fontSize: 13, fontWeight: '700' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111111' },
  subtitle: { fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 20, lineHeight: 18 },
  
  loggerCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 16 },
  loggerLabel: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  inputField: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 12, fontSize: 14, color: '#111', marginBottom: 10 },
  inputRow: { flexDirection: 'row', marginBottom: 4 },
  submitLogButton: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  submitLogButtonText: { color: '#1F2937', fontSize: 14, fontWeight: '700' },
  
  finishWorkoutButton: { backgroundColor: '#111111', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  finishWorkoutButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 },
  emptyContainer: { padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA' },
  emptyText: { color: '#999', fontSize: 13, textAlign: 'center' },
  historyItem: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#EAEAEA', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  itemDetails: { fontSize: 13, color: '#666', fontWeight: '500' },
});