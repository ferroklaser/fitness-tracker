import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { signOut } = useAuth(); // 🔐 Preserved teammate's logic

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Crisp Header Bar */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Activity</Text>
          <Text style={styles.subtitle}>Log your training metrics below.</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut()}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Simple Form Block */}
      <View style={styles.card}>
        <TextInput 
          style={styles.input} 
          placeholder="Exercise name..." 
          value={exercise}
          onChangeText={setExercise}
        />
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 8 }]} 
            placeholder="Weight (kg)" 
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Reps" 
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={handleAddLog}>
          <Text style={styles.actionBtnText}>Save Log Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Clean History stream */}
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
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingTop: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 24 },
  input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 4 },
  actionBtn: { backgroundColor: '#111', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingLeft: 2 },
  historyItem: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#EAEAEA', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  itemDetails: { fontSize: 13, color: '#666', fontWeight: '500' },
});