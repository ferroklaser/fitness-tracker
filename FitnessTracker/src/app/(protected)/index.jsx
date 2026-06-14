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
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ⚡ Quick Action Menu Cards */}
      <Text style={styles.menuLabelTitle}>Quick Actions</Text>
      
      {/* 🏋️‍♂️ 1. Start Empty Workout */}
      <TouchableOpacity 
        style={[styles.menuCard, styles.heroMenuCard]} 
        onPress={() => router.push('/workout/active')}
      >
        <View style={styles.menuLeftSection}>
          <Text style={styles.menuIcon}>🏋️‍♂️</Text>
          <Text style={styles.menuCardTitle}>Start Empty Workout</Text>
        </View>
        <Text style={styles.chevronIcon}>&gt;</Text>
      </TouchableOpacity>

      {/* 🧠 2. AI Recommendation */}
      <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/insights')}>
        <View style={styles.menuLeftSection}>
          <Text style={styles.menuIcon}>🧠</Text>
          <Text style={styles.menuCardTitle}>AI Recommendation</Text>
        </View>
        <Text style={styles.chevronIcon}>&gt;</Text>
      </TouchableOpacity>

      {/* 📁 3. Saved Workouts */}
      <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/workout/saved')}>
        <View style={styles.menuLeftSection}>
          <Text style={styles.menuIcon}>📁</Text>
          <Text style={styles.menuCardTitle}>Saved Workouts</Text>
        </View>
        <Text style={styles.chevronIcon}>&gt;</Text>
      </TouchableOpacity>

      {/* 📋 Stored Logs Output Ledger */}
      <Text style={styles.sectionTitle}>Recent Workouts</Text>

      {logs.length === 0 ? (
        <View style={styles.emptyCardState}>
          <Text style={styles.emptyText}>No workouts logged yet.</Text>
        </View>
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
  headerButtons: { flexDirection: 'row', gap: 10 },
  dateText: { fontSize: 13, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  welcomeText: { fontSize: 28, fontWeight: '800', color: '#111', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, justifyContent: 'center' },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  profileBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, justifyContent: 'center' },
  profileText: { color: '#374151', fontSize: 12, fontWeight: '700' },
  
  menuLabelTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, paddingLeft: 4 },
  menuCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 8 },
  heroMenuCard: { borderColor: '#111111', borderWidth: 1.5 }, 
  menuLeftSection: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuCardTitle: { fontSize: 14, fontWeight: '700', color: '#111111' },
  chevronIcon: { fontSize: 14, fontWeight: '700', color: '#CCCCCC', paddingRight: 2 },

  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 22, paddingLeft: 4 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  itemDetails: { fontSize: 13, color: '#666', fontWeight: '600' },
  historyItem: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#EAEAEA', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  emptyCardState: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#EAEAEA', borderStyle: 'dashed' },
  emptyText: { color: '#999', fontSize: 13, textAlign: 'center' },
});