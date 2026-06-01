import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "@/context/AuthContext";

export default function HomeDashboard() {
  const router = useRouter();
  const { signOut } = useAuth();

  // --- Preserved Workout Logger States ---
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, name: 'Squat', details: '80 kg × 8 reps' },
    { id: 2, name: 'Bench Press', details: '60 kg × 10 reps' }
  ]);

  const handleAddLog = () => {
    if (!exercise || !weight || !reps) {
      Alert.alert("Error", "Please fill in all entry fields.");
      return;
    }
    setLogs([...logs, { id: Date.now(), name: exercise, details: `${weight} kg × ${reps} reps` }]);
    setExercise(''); setWeight(''); setReps('');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 🗓️ Header Area */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.dateText}>{today}</Text>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>
        
        {/* NEW: Profile & Logout Row */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 📊 Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{logs.length}</Text>
          <Text style={styles.statLabel}>Logs Today</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>—</Text>
          <Text style={styles.statLabel}>Kcal Goal</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>Active</Text>
          <Text style={styles.statLabel}>Engines</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      {/* Quick Action Cards */}
      <TouchableOpacity style={[styles.actionCard, styles.primaryCard]} onPress={() => router.push('/workout/active')}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardEmoji}>🏋️‍♂️</Text>
          <View style={styles.textGroup}>
            <Text style={[styles.cardTitle, styles.whiteText]}>Start Empty Workout</Text>
            <Text style={[styles.cardDesc, styles.lightText]}>Log training on the fly</Text>
          </View>
        </View>
        <Text style={styles.arrowIcon}>➔</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/ai-coach')}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardEmoji}>🧠</Text>
          <View style={styles.textGroup}>
            <Text style={styles.cardTitle}>AI Recommendation</Text>
            <Text style={styles.cardDesc}>Custom splits for your goals</Text>
          </View>
        </View>
        <Text style={styles.arrowIconLight}>➔</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/workout/saved')}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardEmoji}>📂</Text>
          <View style={styles.textGroup}>
            <Text style={styles.cardTitle}>Saved Workouts</Text>
            <Text style={styles.cardDesc}>Run your template splits</Text>
          </View>
        </View>
        <Text style={styles.arrowIconLight}>➔</Text>
      </TouchableOpacity>

      {/* 📝 Quick Entry Logger */}
      <Text style={styles.sectionTitle}>Quick Entry Logger</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Exercise name..." value={exercise} onChangeText={setExercise} />
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Reps" keyboardType="numeric" value={reps} onChangeText={setReps} />
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={handleAddLog}>
          <Text style={styles.actionBtnText}>Save Log Entry</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Today's Ledger</Text>
      {logs.map((item) => (
        <View key={item.id} style={styles.historyItem}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemDetails}>{item.details}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingVertical: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  dateText: { fontSize: 13, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  welcomeText: { fontSize: 28, fontWeight: '800', color: '#111', marginTop: 2 },
  
  // Buttons
  logoutBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  profileBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  profileText: { color: '#374151', fontSize: 12, fontWeight: '700' },

  // Quick Stats
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  statBox: { flex: 1, backgroundColor: '#FFF', padding: 14, borderRadius: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#EAEAEA', alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#111' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },

  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 16, paddingLeft: 4 },

  // Action Cards
  actionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 16, padding: 18, marginBottom: 12 },
  primaryCard: { backgroundColor: '#111', borderColor: '#111' },
  cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 0.9 },
  cardEmoji: { fontSize: 26, marginRight: 14 },
  textGroup: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  cardDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  whiteText: { color: '#FFF' },
  lightText: { color: '#A1A1AA' },
  arrowIcon: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  arrowIconLight: { color: '#B1B1B1', fontSize: 16, fontWeight: '600' },

  // Logger Form
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 24 },
  input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 12, color: '#111' },
  row: { flexDirection: 'row', marginBottom: 4 },
  actionBtn: { backgroundColor: '#111', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  historyItem: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#EAEAEA', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  itemDetails: { fontSize: 13, color: '#666', fontWeight: '500' },
});