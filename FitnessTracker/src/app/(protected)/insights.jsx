import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext'; // 🌐 1. Import our custom memory cloud hook

export default function Onboarding() {
  const router = useRouter();
  const { updateProfile } = useUser(); // 🧬 2. Pull down the data-updating executor function
  
  // Onboarding Form States
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [experience, setExperience] = useState('beginner');
  const [targetWeight, setTargetWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('lightlyActive');
  const [selectedGoals, setSelectedGoals] = useState([]);

  const fitnessGoalsOptions = [
    { id: 'weightLoss', label: 'Weight Loss (Fat loss / Toning)' },
    { id: 'muscleGain', label: 'Muscle Gain (Hypertrophy / Bulking)' },
    { id: 'endurance', label: 'Improve Endurance (Run longer/faster)' },
    { id: 'strength', label: 'Get Stronger (Strength/Powerlifting)' },
    { id: 'health', label: 'Improve Health (General wellness / Feel better)' },
  ];

  const activityOptions = [
    { id: 'sedentary', label: 'Sedentary', desc: 'Desk job / little to no exercise', multiplier: 1.2 },
    { id: 'lightlyActive', label: 'Lightly Active', desc: 'Light exercise (1-2 days/week)', multiplier: 1.375 },
    { id: 'moderatelyActive', label: 'Moderately Active', desc: 'Moderate exercise (3-4 days/week)', multiplier: 1.55 },
    { id: 'veryActive', label: 'Very Active', desc: 'Hard labor / heavy sport (5+ days/week)', multiplier: 1.725 },
  ];

  const toggleFitnessGoal = (goalId) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSaveGoals = () => {
    if (!age || !weight || !height || !targetWeight) {
      showAlert("Missing Fields", "Please complete all mandatory parameters to compute your targets.");
      return;
    }

    if (selectedGoals.length === 0) {
      showAlert("Goal Missing", "Please select at least one fitness path goal strategy.");
      return;
    }

    // 🧮 Smart BMR Calorie Calculation
    let wNum = parseFloat(weight);
    let hNum = parseFloat(height);
    let aNum = parseInt(age);
    
    let bmr = (10 * wNum) + (6.25 * hNum) - (5 * aNum);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    const activeObj = activityOptions.find(opt => opt.id === activityLevel) || activityOptions[1];
    let baseCalories = Math.round(bmr * activeObj.multiplier);

    selectedGoals.forEach((goalId) => {
      if (goalId === 'muscleGain') baseCalories += 350;
      if (goalId === 'weightLoss') baseCalories -= 400;
      if (goalId === 'strength') baseCalories += 150;
      if (goalId === 'endurance') baseCalories += 200;
    });

    // 💾 SAVE ACTION TO GLOBAL CONTEXT
    updateProfile({
      gender,
      age,
      weight,
      height,
      bodyFat,
      experience,
      targetWeight,
      activityLevel,
      selectedGoals,
      computedCalories: baseCalories
    });

    showAlert("🎯 Profile Configured!", `Daily energy intake target established at ${baseCalories} kcal.`);
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Establish Goals</Text>
      <Text style={styles.subtitle}>Configure your profile statistics to calibrate our tracking engines.</Text>

      <View style={styles.card}>
        {/* Gender */}
        <Text style={styles.labelTitle}>Biological Gender</Text>
        <View style={styles.toggleButtonGroup}>
          {['male', 'female'].map((g) => (
            <TouchableOpacity 
              key={g}
              style={[styles.toggleButton, gender === g && styles.toggleButtonActive]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.toggleButtonText, gender === g && styles.toggleButtonTextActive]}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Biometrics */}
        <Text style={styles.sectionHeading}>Current Metrics</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 8 }]} 
            placeholder="Age" 
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 8 }]} 
            placeholder="Weight (kg)" 
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Height (cm)" 
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        {/* Body Fat */}
        <Text style={styles.labelTitle}>Body Fat Percentage (Optional)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 14.5 (%)" 
          keyboardType="numeric"
          value={bodyFat}
          onChangeText={setBodyFat}
        />

        {/* Activity Level */}
        <Text style={styles.labelTitle}>Daily Activity Level</Text>
        <View style={styles.activityGroupStack}>
          {activityOptions.map((option) => {
            const isActive = activityLevel === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.activityCardButton, isActive && styles.activityCardButtonActive]}
                onPress={() => setActivityLevel(option.id)}
              >
                <View style={styles.activityTextContainer}>
                  <Text style={[styles.activityLabelText, isActive && styles.activityLabelTextActive]}>
                    {option.label}
                  </Text>
                  <Text style={styles.activityDescText}>
                    {option.desc}
                  </Text>
                </View>
                <View style={[styles.radioIndicator, isActive && styles.radioIndicatorActive]}>
                  {isActive && <View style={styles.radioInnerCircle} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fitness Paths */}
        <Text style={styles.labelTitle}>Fitness Path Targets (Select Multiple)</Text>
        <View style={styles.checkboxGroupStack}>
          {fitnessGoalsOptions.map((option) => {
            const isSelected = selectedGoals.includes(option.id);
            return (
              <TouchableOpacity 
                key={option.id}
                style={[styles.checkboxRowButton, isSelected && styles.checkboxRowButtonActive]}
                onPress={() => toggleFitnessGoal(option.id)}
              >
                <View style={[styles.checkboxIndicator, isSelected && styles.checkboxIndicatorActive]}>
                  {isSelected ? <Text style={styles.checkmarkIconText}>✓</Text> : null}
                </View>
                <Text style={[styles.checkboxLabelText, isSelected && styles.checkboxLabelTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Experience Level */}
        <Text style={styles.labelTitle}>Current Experience Level</Text>
        <View style={styles.toggleButtonGroup}>
          {['beginner', 'intermediate', 'advanced'].map((level) => (
            <TouchableOpacity 
              key={level}
              style={[styles.toggleButton, experience === level && styles.toggleButtonActive]}
              onPress={() => setExperience(level)}
            >
              <Text style={[styles.toggleButtonText, experience === level && styles.toggleButtonTextActive]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight Target Objective */}
        <Text style={styles.labelTitle}>Target Weight Objective</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Desired Weight Target (kg)" 
          keyboardType="numeric"
          value={targetWeight}
          onChangeText={setTargetWeight}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSaveGoals}>
          <Text style={styles.submitButtonText}>Save & Compute Calorie Blueprint</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingVertical: 32 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111111' },
  subtitle: { fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 20, lineHeight: 18 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#EAEAEA' },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#888888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  labelTitle: { fontSize: 12, fontWeight: '700', color: '#444444', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 12, color: '#111111' },
  inputRow: { flexDirection: 'row', marginBottom: 4 },
  toggleButtonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  toggleButton: { flex: 1, backgroundColor: '#F5F5F5', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 2, borderWidth: 1, borderColor: '#EAEAEA' },
  toggleButtonActive: { backgroundColor: '#111111', borderColor: '#111111' },
  toggleButtonText: { fontSize: 11, color: '#666666', fontWeight: '600' },
  toggleButtonTextActive: { color: '#FFFFFF', fontWeight: '700' },
  activityGroupStack: { marginBottom: 14 },
  activityCardButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EAEAEA', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginBottom: 6 },
  activityCardButtonActive: { backgroundColor: '#F8FAFC', borderColor: '#111111', borderWidth: 1.5 },
  activityTextContainer: { flex: 0.9 },
  activityLabelText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  activityLabelTextActive: { color: '#111111', fontWeight: '700' },
  activityDescText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  radioIndicator: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#CBD5E1', backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  radioIndicatorActive: { borderColor: '#111111' },
  radioInnerCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#111111' },
  checkboxGroupStack: { marginBottom: 12 },
  checkboxRowButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: '#EAEAEA' },
  checkboxRowButtonActive: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  checkboxIndicator: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#CBD5E1', marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  checkboxIndicatorActive: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  checkmarkIconText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  checkboxLabelText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  checkboxLabelTextActive: { color: '#166534', fontWeight: '600' },
  submitButton: { backgroundColor: '#111111', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 14 },
  submitButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});