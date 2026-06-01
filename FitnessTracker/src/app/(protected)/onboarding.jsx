import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding() {
  const router = useRouter();
  
  // Onboarding Form States
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('general'); // bodybuilding / powerlifting / general
  const [experience, setExperience] = useState('beginner'); // beginner / intermediate / advanced
  const [targetWeight, setTargetWeight] = useState('');

  const handleSaveGoals = () => {
    if (!age || !weight || !height || !targetWeight) {
      Alert.alert("Missing Fields", "Please complete all fields to compute your initial targets.");
      return;
    }

    // 🧮 Calorie Calculation Logic linked strictly to user choices
    let baseCalories = Math.round((10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseInt(age)) + 500);

    if (fitnessGoal === 'bodybuilding') {
      baseCalories += 400; // Caloric surplus for mass development
    } else if (fitnessGoal === 'powerlifting') {
      baseCalories += 200; // Strength optimization energy scaling
    } else {
      baseCalories -= 200; // Trimming target baseline deficit
    }

    Alert.alert(
      "🎯 Profile Configured!",
      `Daily energy intake target established at ${baseCalories} kcal to support your target of ${targetWeight} kg.`,
      [
        { 
          text: "Enter Dashboard", 
          onPress: () => {
            router.replace('/');
          } 
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Establish Goals</Text>
      <Text style={styles.subtitle}>Configure your profile statistics to calibrate our tracking engines.</Text>

      <View style={styles.card}>
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

        {/* Fitness Path Focus Selection */}
        <Text style={styles.labelTitle}>Fitness Path Focus</Text>
        <View style={styles.toggleButtonGroup}>
          {['bodybuilding', 'powerlifting', 'general'].map((goal) => (
            <TouchableOpacity 
              key={goal}
              style={[styles.toggleButton, fitnessGoal === goal && styles.toggleButtonActive]}
              onPress={() => setFitnessGoal(goal)}
            >
              <Text style={[styles.toggleButtonText, fitnessGoal === goal && styles.toggleButtonTextActive]}>
                {goal.charAt(0).toUpperCase() + goal.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Experience Competency Selectors */}
        <Text style={styles.labelTitle}>Experience Level</Text>
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

        {/* Weight Target Field */}
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
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, justifyContent: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111111' },
  subtitle: { fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 20, lineHeight: 18 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#EAEAEA' },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#888888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  labelTitle: { fontSize: 12, fontWeight: '700', color: '#444444', marginBottom: 8, marginTop: 4 },
  input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 12, color: '#111111' },
  inputRow: { flexDirection: 'row', marginBottom: 4 },
  toggleButtonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  toggleButton: { flex: 1, backgroundColor: '#F5F5F5', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 2, borderWidth: 1, borderColor: '#EAEAEA' },
  toggleButtonActive: { backgroundColor: '#111111', borderColor: '#111111' },
  toggleButtonText: { fontSize: 11, color: '#666666', fontWeight: '600' },
  toggleButtonTextActive: { color: '#FFFFFF', fontWeight: '700' },
  submitButton: { backgroundColor: '#111111', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});