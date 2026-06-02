import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // 👈 1. Import router wrapper
import { useUser } from '@/context/UserContext'; 
import { useAuth } from '@/context/AuthContext'; 

export default function Profile() {
  const router = useRouter(); // 👈 2. Initialize navigation hook
  const { profile, updateProfile } = useUser(); 
  const { user, signOut } = useAuth(); 

  // 📝 Local states to handle live input editing fields
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState(profile.weight || '');
  const [editedHeight, setEditedHeight] = useState(profile.height || '');
  const [editedAge, setEditedAge] = useState(profile.age || '');

  const handleSignOut = () => {
    Alert.alert("🚪 Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => signOut() }
    ]);
  };

  const handleSaveChanges = () => {
    if (!editedAge || !editedWeight || !editedHeight) {
      Alert.alert("Missing Fields", "Please make sure Age, Weight, and Height are filled out.");
      return;
    }

    let wNum = parseFloat(editedWeight);
    let hNum = parseFloat(editedHeight);
    let aNum = parseInt(editedAge);
    
    let bmr = (10 * wNum) + (6.25 * hNum) - (5 * aNum);
    bmr = profile.gender === 'male' ? bmr + 5 : bmr - 161;

    const activityMultipliers = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725
    };
    const multiplier = activityMultipliers[profile.activityLevel] || 1.375;
    let newCalories = Math.round(bmr * multiplier);

    (profile.selectedGoals || []).forEach((goalId) => {
      if (goalId === 'muscleGain') newCalories += 350;
      if (goalId === 'weightLoss') newCalories -= 400;
      if (goalId === 'strength') newCalories += 150;
      if (goalId === 'endurance') newCalories += 200;
    });

    updateProfile({
      age: editedAge,
      weight: editedWeight,
      height: editedHeight,
      computedCalories: newCalories
    });

    setIsEditing(false); 
    Alert.alert("🎯 Metrics Updated", "Your biometrics and daily calorie targets have been recalculated!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* 🧭 NEW: Top Navigation Row Back To Index Dashboard */}
      <TouchableOpacity style={styles.backButtonRow} onPress={() => router.replace('/')}>
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>User Profile</Text>
      <Text style={styles.subtitle}>View or calibrate your verified account profile variables below.</Text>

      {/* Calorific Highlight Card */}
      <View style={styles.calorificHighlightCard}>
        <Text style={styles.cardLabel}>Calculated Energy Intake Blueprint</Text>
        <Text style={styles.calorieNumber}>{profile.computedCalories || 0} kcal / day</Text>
      </View>

      {/* Dynamic Profile Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Account Name</Text>
          <Text style={styles.value}>{user?.email?.split('@')[0] || 'User'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{user?.email || '—'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Biological Sex</Text>
          <Text style={styles.value}>{profile.gender ? profile.gender.toUpperCase() : '—'}</Text>
        </View>

        {/* ✏️ Editable Age Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Current Age</Text>
          {isEditing ? (
            <TextInput
              style={styles.inlineInput}
              keyboardType="numeric"
              value={editedAge.toString()}
              onChangeText={setEditedAge}
            />
          ) : (
            <Text style={styles.value}>{profile.age ? `${profile.age} yrs` : '—'}</Text>
          )}
        </View>

        {/* ✏️ Editable Weight Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Current Weight</Text>
          {isEditing ? (
            <TextInput
              style={styles.inlineInput}
              keyboardType="numeric"
              value={editedWeight.toString()}
              onChangeText={setEditedWeight}
            />
          ) : (
            <Text style={styles.value}>{profile.weight ? `${profile.weight} kg` : '—'}</Text>
          )}
        </View>

        {/* ✏️ Editable Height Row */}
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Height Baseline</Text>
          {isEditing ? (
            <TextInput
              style={styles.inlineInput}
              keyboardType="numeric"
              value={editedHeight.toString()}
              onChangeText={setEditedHeight}
            />
          ) : (
            <Text style={styles.value}>{profile.height ? `${profile.height} cm` : '—'}</Text>
          )}
        </View>
      </View>

      {/* 🛠️ Action Toggle Row */}
      <View style={styles.actionButtonGroup}>
        {isEditing ? (
          <>
            <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={handleSaveChanges}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <Text style={styles.editBtnText}>Edit Metrics</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingTop: 24 },
  
  // Navigation Style Link
  backButtonRow: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 4, marginBottom: 16 },
  backButtonText: { color: '#666', fontSize: 13, fontWeight: '700' },

  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 24 },
  calorificHighlightCard: { backgroundColor: '#111', borderRadius: 12, padding: 18, marginBottom: 16 },
  cardLabel: { color: '#AAA', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  calorieNumber: { color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 16 },
  label: { fontSize: 13, color: '#666', fontWeight: '500', flex: 1 },
  value: { fontSize: 14, color: '#111', fontWeight: '700', textAlign: 'right', flex: 2 },
  inlineInput: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10, fontSize: 14, fontWeight: '700', color: '#111', textAlign: 'right', width: 100 },
  actionButtonGroup: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  editBtn: { flex: 1, backgroundColor: '#111111', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  editBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  saveBtn: { backgroundColor: '#22C55E' },
  saveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  cancelBtn: { backgroundColor: '#E5E7EB', borderWidth: 1, borderColor: '#D1D5DB' },
  cancelBtnText: { color: '#374151', fontSize: 14, fontWeight: '600' },
  button: { borderColor: '#EF4444', borderWidth: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
});