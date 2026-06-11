import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "@/context/AuthContext";
import { getWorkoutLogs } from "@/services/workoutServices";

export default function HomeDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  // --- fetch workout logs from Supabase ---
  const [logs, setLogs] = useState([]);

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
        
        {/* Profile & Logout Row */}
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
          <Text style={styles.statLabel}>Today's Exercises</Text>
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

      {/* ⚡ Quick Action Menu Cards */}
      <Text style={styles.menuLabelTitle}>Quick Actions</Text>
      
      {/* 🏋️‍♂️ 1. Start Empty Workout */}
      <TouchableOpacity 
        style={[styles.menuCard, styles.heroMenuCard]} 
        onPress={() => router.push('/workout/active')}
      >
        <Text style={styles.menuIcon}>🏋️‍♂️</Text>
        <View style={styles.menuTextDetails}>
          <Text style={styles.menuCardTitle}>Start Empty Workout</Text>
          <Text style={styles.menuCardDesc}>Log custom tracking metrics on the fly</Text>
        </View>
      </TouchableOpacity>

      {/* 🧠 2. AI Recommendation */}
      <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/insights')}>
        <Text style={styles.menuIcon}>🧠</Text>
        <View style={styles.menuTextDetails}>
          <Text style={styles.menuCardTitle}>AI Recommendation</Text>
          <Text style={styles.menuCardDesc}>Custom telemetry intelligence optimization reports</Text>
        </View>
      </TouchableOpacity>

      {/* 📁 3. Saved Workouts (Now linked to saved.jsx!) */}
      <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/workout/saved')}>
        <Text style={styles.menuIcon}>📁</Text>
        <View style={styles.menuTextDetails}>
          <Text style={styles.menuCardTitle}>Saved Workouts</Text>
          <Text style={styles.menuCardDesc}>Run your preset custom training splits</Text>
        </View>
      </TouchableOpacity>

      {/* 📋 Stored Logs Output Ledger */}
      <Text style={styles.sectionTitle}>Recent Workouts</Text>

      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No workouts logged yet.</Text>
      ) : (
        logs.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text style={styles.itemTitle}>{item.exercise_name}</Text>
            <Text style={styles.itemDetails}>
              {item.sets} sets × {item.reps} reps × {item.weight} kg
            </Text>
          </View>
        ))
      )}
          </ScrollView>
        );
      }

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingVertical: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  dateText: { fontSize: 13, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  welcomeText: { fontSize: 28, fontWeight: '800', color: '#111', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  profileBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  profileText: { color: '#374151', fontSize: 12, fontWeight: '700' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: '#FFF', padding: 14, borderRadius: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#EAEAEA', alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#111' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  
  menuLabelTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, paddingLeft: 4 },
  menuCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 8 },
  heroMenuCard: { borderColor: '#111111', borderWidth: 1.5 }, 
  menuIcon: { fontSize: 22, marginRight: 14 },
  menuTextDetails: { flex: 1 },
  menuCardTitle: { fontSize: 14, fontWeight: '800', color: '#111111' },
  menuCardDesc: { fontSize: 12, color: '#666666', marginTop: 2 },

  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 20, paddingLeft: 4 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  itemDetails: { fontSize: 13, color: '#666', fontWeight: '500' },
  historyItem: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#EAEAEA', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  emptyText: { color: '#999', fontSize: 13, textAlign: 'center', marginTop: 10 },
});