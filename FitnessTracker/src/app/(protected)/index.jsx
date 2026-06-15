import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from "@/context/AuthContext";
import { getWorkoutLogs, deleteWorkoutLog, updateWorkoutLog } from '@/services/workoutServices';

function groupBySessions(logs) {
  const map = {};
  logs.forEach((log) => {
    const sid = log.session_id;
    if (!map[sid]) {
      map[sid] = { session_id: sid, date: log.created_at, exercises: [] };
    }
    if (new Date(log.created_at) < new Date(map[sid].date)) {
      map[sid].date = log.created_at;
    }
    map[sid].exercises.push(log);
  });
  return Object.values(map).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function ExerciseRow({ ex, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(ex.exercise_name);
  const [sets, setSets] = useState(String(ex.sets));
  const [reps, setReps] = useState(String(ex.reps));
  const [weight, setWeight] = useState(String(ex.weight));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(ex.id, {
      exercise_name: name.trim() || ex.exercise_name,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
    });
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setName(ex.exercise_name);
    setSets(String(ex.sets));
    setReps(String(ex.reps));
    setWeight(String(ex.weight));
    setEditing(false);
  };

  if (editing) {
    return (
      <View style={sStyles.editRow}>
        <View style={sStyles.editNameRow}>
          <Text style={sStyles.editFieldLabel}>Exercise</Text>
          <TextInput
            style={[sStyles.editInput, sStyles.editNameInput]}
            value={name}
            onChangeText={setName}
            placeholder="Exercise name"
          />
        </View>
        <View style={sStyles.editFields}>
          <View style={sStyles.editField}>
            <Text style={sStyles.editFieldLabel}>Sets</Text>
            <TextInput
              style={sStyles.editInput}
              value={sets}
              onChangeText={setSets}
              keyboardType="numeric"
            />
          </View>
          <View style={sStyles.editField}>
            <Text style={sStyles.editFieldLabel}>Reps</Text>
            <TextInput
              style={sStyles.editInput}
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
            />
          </View>
          <View style={sStyles.editField}>
            <Text style={sStyles.editFieldLabel}>kg</Text>
            <TextInput
              style={sStyles.editInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={sStyles.editActions}>
          <TouchableOpacity style={sStyles.saveBtn} onPress={handleSave} disabled={saving}>
            <Text style={sStyles.saveBtnText}>{saving ? '...' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sStyles.cancelBtn} onPress={handleCancel}>
            <Text style={sStyles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={sStyles.exerciseRow}>
      <View style={sStyles.exerciseInfo}>
        <Text style={sStyles.exerciseName}>{ex.exercise_name}</Text>
        <Text style={sStyles.exerciseDetail}>
          {ex.sets} × {ex.reps} reps · {ex.weight} kg
        </Text>
      </View>
      <View style={sStyles.rowActions}>
        <TouchableOpacity style={sStyles.editBtn} onPress={() => setEditing(true)}>
          <Text style={sStyles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={sStyles.deleteBtn} onPress={() => onDelete(ex.id)}>
          <Text style={sStyles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SessionCard({ session, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const uniqueExercises = [...new Set(session.exercises.map((e) => e.exercise_name))];

  return (
    <View style={sStyles.card}>
      <TouchableOpacity style={[sStyles.header, expanded && sStyles.headerExpanded]} onPress={() => setExpanded((v) => !v)} activeOpacity={0.7}>
        <View style={sStyles.headerLeft}>
          <Text style={sStyles.dateText}>{date}</Text>
          <Text style={sStyles.summaryText}>
            {uniqueExercises.slice(0, 3).join(' · ')}
            {uniqueExercises.length > 3 ? ` +${uniqueExercises.length - 3} more` : ''}
          </Text>
        </View>
        <View style={sStyles.headerRight}>
          <Text style={sStyles.countBadge}>
            {session.exercises.length} set{session.exercises.length !== 1 ? 's' : ''}
          </Text>
          <Text style={sStyles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={sStyles.exerciseList}>
          {session.exercises.map((ex) => (
            <ExerciseRow key={ex.id} ex={ex} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </View>
      )}
    </View>
  );
}

const sStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6799b6ff',
    borderRadius: 14,
  },
  headerExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerLeft: { flex: 1, marginRight: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  summaryText: { fontSize: 12, color: '#f2f9ebff', marginTop: 3 },
  countBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  chevron: { fontSize: 10, color: '#6B7280' },


  exerciseList: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  exerciseDetail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  rowActions: { flexDirection: 'row', gap: 6, marginLeft: 10 },
  editBtn: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  editBtnText: { color: '#2563EB', fontSize: 12, fontWeight: '700' },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  deleteBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },

  // Inline edit row
  editRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0F9FF',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  editNameRow: { marginBottom: 10 },
  editNameInput: {
    textAlign: 'left',
    marginTop: 4,
    width: '100%',
  },
  editExerciseName: { fontSize: 13, fontWeight: '700', color: '#0369A1', marginBottom: 8 },
  editFields: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  editField: { flex: 1, alignItems: 'center' },
  editFieldLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 4, textTransform: 'uppercase' },
  editInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
  },
  editActions: { flexDirection: 'row', gap: 8 },
  saveBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#64748B', fontSize: 13, fontWeight: '600' },
});

export default function HomeDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { toast } = useLocalSearchParams();

  const [logs, setLogs] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (toast === "workout_saved") {
      setToastVisible(true);
      const timer = setTimeout(() => setToastVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      if (user?.id) {
        const { data, error } = await getWorkoutLogs(user.id);
        if (!error && data) setLogs(data);
      }
    };
    fetchWorkoutLogs();
  }, [user?.id]);

  const handleDelete = async (id) => {
    const { error } = await deleteWorkoutLog(id);
    if (!error) {
      setLogs((prev) => prev.filter((log) => log.id !== id));
    }
  };

  const handleUpdate = async (id, updates) => {
    const { data, error } = await updateWorkoutLog(id, updates);
    if (!error && data?.[0]) {
      setLogs((prev) => prev.map((log) => (log.id === id ? { ...log, ...data[0] } : log)));
    }
  };

  const sessions = useMemo(() => groupBySessions(logs), [logs]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

      {toastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✅ Workout saved!</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.dateText}>{today}</Text>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.menuLabelTitle}>Quick Actions</Text>

      <TouchableOpacity style={[styles.menuCard, styles.heroMenuCard]} onPress={() => router.push('/workout/active')}>
        <View style={styles.menuLeftSection}>
          <Text style={styles.menuIcon}>🏋️‍♂️</Text>
          <Text style={styles.menuCardTitle}>Start New Workout</Text>
        </View>
        <Text style={styles.chevronIcon}>&gt;</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/insights')}>
        <View style={styles.menuLeftSection}>
          <Text style={styles.menuIcon}>🧠</Text>
          <Text style={styles.menuCardTitle}>AI Recommendation</Text>
        </View>
        <Text style={styles.chevronIcon}>&gt;</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/workout/saved')}>
        <View style={styles.menuLeftSection}>
          <Text style={styles.menuIcon}>📁</Text>
          <Text style={styles.menuCardTitle}>Saved Workouts</Text>
        </View>
        <Text style={styles.chevronIcon}>&gt;</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        Workout History ({sessions.length} session{sessions.length !== 1 ? 's' : ''})
      </Text>

      {sessions.length === 0 ? (
        <View style={styles.emptyCardState}>
          <Text style={styles.emptyText}>No workouts logged yet.</Text>
        </View>
      ) : (
        sessions.map((session) => (
          <SessionCard key={session.session_id} session={session} onDelete={handleDelete} onUpdate={handleUpdate} />
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
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 20, paddingLeft: 4 },
  emptyCardState: { padding: 32, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA' },
  emptyText: { color: '#999', fontSize: 13, textAlign: 'center' },
  toast: { backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, marginBottom: 16, alignSelf: 'flex-start' },
  toastText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
});
