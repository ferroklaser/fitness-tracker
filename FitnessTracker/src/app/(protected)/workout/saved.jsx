import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SavedWorkoutsCatalog() {
  const router = useRouter();

  // 📝 1. Templates Local State Array
  const [templates, setTemplates] = useState([
    {
      id: 'split_1',
      title: 'Hypertrophy Push Day',
      focus: 'Chest, Shoulders & Triceps Focus',
      accentColor: '#3B82F6',
      exercises: [
        { name: 'Barbell Bench Press', sets: '3', reps: '8', weight: '80' },
        { name: 'Incline Dumbbell Flys', sets: '3', reps: '10', weight: '22' },
        { name: 'Overhead Press', sets: '4', reps: '8', weight: '50' },
        { name: 'Tricep Pushdowns', sets: '3', reps: '12', weight: '25' }
      ]
    },
    {
      id: 'split_2',
      title: 'Powerlifting Pull Engine',
      focus: 'Posterior Chain & Deadlift Strength',
      accentColor: '#10B981',
      exercises: [
        { name: 'Conventional Deadlifts', sets: '4', reps: '5', weight: '140' },
        { name: 'Barbell Rows', sets: '3', reps: '8', weight: '70' },
        { name: 'Lat Pulldowns', sets: '3', reps: '10', weight: '65' },
        { name: 'Hammer Curls', sets: '3', reps: '12', weight: '16' }
      ]
    },
    {
      id: 'split_3',
      title: 'Leg Day Volume Stack',
      focus: 'Quad Dominant Quad-Core Growth',
      accentColor: '#F59E0B',
      exercises: [
        { name: 'Barbell Back Squats', sets: '4', reps: '8', weight: '100' },
        { name: 'Romanian Deadlifts', sets: '3', reps: '10', weight: '80' },
        { name: 'Leg Extensions', sets: '3', reps: '15', weight: '45' },
        { name: 'Calf Raises', sets: '4', reps: '20', weight: '60' }
      ]
    }
  ]);

  // 🕹️ Accordion Toggle Tracking State Layer
  const [expandedCardIds, setExpandedCardIds] = useState(['split_1']); // Keeps the first one open by default

  // 🕹️ Local Form Editing State Handlers
  const [editingCardId, setEditingCardId] = useState(null); 
  const [editTitle, setEditTitle] = useState('');
  const [editFocus, setEditFocus] = useState('');
  const [editExercises, setEditExercises] = useState([]);

  // 🔄 Toggle Expand/Collapse function
  const toggleCardAccordion = (cardId) => {
    if (editingCardId === cardId) return; // Block collapsing while actively editing

    if (expandedCardIds.includes(cardId)) {
      setExpandedCardIds(expandedCardIds.filter(id => id !== cardId));
    } else {
      setExpandedCardIds([...expandedCardIds, cardId]);
    }
  };

  // ➕ Routine Spawner
  const handleAddNewRoutine = () => {
    if (editingCardId) {
      Alert.alert("Action Blocked", "Please save or cancel your current template edits before adding a new routine.");
      return;
    }

    const newGeneratedId = `custom_${Date.now()}`;
    const randomColors = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
    const assignedColor = randomColors[Math.floor(Math.random() * randomColors.length)];

    const blankTemplateObj = {
      id: newGeneratedId,
      title: '',
      focus: '',
      accentColor: assignedColor,
      exercises: [
        { name: '', sets: '', reps: '', weight: '' },
        { name: '', sets: '', reps: '', weight: '' }
      ]
    };

    setTemplates([blankTemplateObj, ...templates]);
    setEditingCardId(newGeneratedId);
    
    // Auto-expand newly created cards so the form displays immediately
    setExpandedCardIds([...expandedCardIds, newGeneratedId]);
    
    setEditTitle('');
    setEditFocus('');
    setEditExercises([
      { name: '', sets: '', reps: '', weight: '' },
      { name: '', sets: '', reps: '', weight: '' }
    ]);
  };

  const handleLaunchTemplate = (templateName) => {
    if (editingCardId) return;

    Alert.alert(
      "🚀 Initialize Session", 
      `Would you like to populate the Live Workout Room tracker with your "${templateName || 'Custom Routine'}" split metrics?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Launch Split", onPress: () => router.replace('/workout/active') }
      ]
    );
  };

  const startEditing = (card) => {
    setEditingCardId(card.id);
    setEditTitle(card.title || '');
    setEditFocus(card.focus || '');
    setEditExercises((card.exercises || []).map(ex => ({
      name: ex.name || '',
      sets: ex.sets || '',
      reps: ex.reps || '',
      weight: ex.weight || ''
    })));

    // Ensure it's open visually when entering edit mode
    if (!expandedCardIds.includes(card.id)) {
      setExpandedCardIds([...expandedCardIds, card.id]);
    }
  };

  const handleExerciseNestedChange = (field, value, index) => {
    const updated = [...editExercises];
    updated[index][field] = value;
    setEditExercises(updated);
  };

  const addExerciseInputFieldRow = () => {
    setEditExercises([...editExercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const removeExerciseInputFieldRow = (indexToRemove) => {
    if (editExercises.length <= 1) {
      Alert.alert("Action Blocked", "A training routine split needs to contain at least 1 exercise movement slot.");
      return;
    }
    setEditExercises(editExercises.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteEntireTemplate = (cardId, cardTitle) => {
    Alert.alert(
      "🛑 Delete Template",
      `Are you sure you want to permanently erase the "${cardTitle || 'this custom split'}" template routine from your workspace?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Entirely", 
          style: "destructive", 
          onPress: () => {
            setTemplates(templates.filter(card => card.id !== cardId));
            setExpandedCardIds(expandedCardIds.filter(id => id !== cardId));
            setEditingCardId(null);
            Alert.alert("Template Purged", "The selected routine layout has been deleted.");
          } 
        }
      ]
    );
  };

  const saveCardChanges = (cardId) => {
    if (!editTitle.trim() || !editFocus.trim()) {
      Alert.alert("Error", "Title and Focus fields cannot be left completely empty.");
      return;
    }

    const validatedExercises = editExercises
      .filter(ex => ex && ex.name && ex.name.trim() !== '') 
      .map(ex => ({
        name: ex.name,
        sets: ex.sets || '0',
        reps: ex.reps || '0',
        weight: ex.weight || '0'
      }));

    if (validatedExercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise with a valid name.");
      return;
    }

    setTemplates(templates.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          title: editTitle,
          focus: editFocus,
          exercises: validatedExercises
        };
      }
      return card;
    }));

    setEditingCardId(null); 
    Alert.alert("🎯 Split Configured", "Template metrics saved cleanly inside app runtime engine!");
  };

  const cancelCardChanges = (cardId) => {
    if (cardId.startsWith('custom_')) {
      setTemplates(templates.filter(card => card.id !== cardId));
      setExpandedCardIds(expandedCardIds.filter(id => id !== cardId));
    }
    setEditingCardId(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 🧭 Top Navigation */}
      <View style={styles.topControlMenuBar}>
        <TouchableOpacity style={styles.backLinkRow} onPress={() => router.replace('/')}>
          <Text style={styles.backLinkText}>← Back to Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addNewRoutineBtn} onPress={handleAddNewRoutine}>
          <Text style={styles.addNewRoutineBtnText}>＋ Add New Routine</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>Preset Split Templates</Text>
      <Text style={styles.subtitle}>Select or customize an established routine profile deck below to instantly configure your training metrics stack.</Text>

      {/* Render Lists Stack Grid */}
      {templates.map((item) => {
        const isCurrentCardEditing = editingCardId === item.id;
        const isCardExpanded = expandedCardIds.includes(item.id);

        return (
          <View key={item.id} style={styles.cardContainer}>
            <View style={[styles.templateCard, isCurrentCardEditing && styles.templateCardEditing]}>
              
              {/* 🏠 Clickable Header Block for Toggling Expand/Collapse States */}
              <TouchableOpacity 
                activeOpacity={isCurrentCardEditing ? 1 : 0.6}
                style={styles.cardHeaderRowClickable}
                onPress={() => toggleCardAccordion(item.id)}
              >
                <View style={[styles.colorBadgeIndicator, { backgroundColor: item.accentColor }]} />
                <View style={{ flex: 1 }}>
                  {isCurrentCardEditing ? (
                    <>
                      <TextInput 
                        style={styles.inlineTextInputTitle}
                        value={editTitle}
                        onChangeText={setEditTitle}
                        placeholder="e.g., Pull Day Power Stack"
                      />
                      <TextInput 
                        style={styles.inlineTextInputFocus}
                        value={editFocus}
                        onChangeText={setEditFocus}
                        placeholder="e.g., Back & Biceps Focus"
                      />
                    </>
                  ) : (
                    <View>
                      <Text style={styles.templateTitle}>{item.title || "Untitled Split Routine"}</Text>
                      <Text style={styles.templateFocus}>{item.focus || "No description set"}</Text>
                    </View>
                  )}
                </View>

                {/* Status Indicator Icon & Edit Triggers */}
                <View style={styles.headerRightControls}>
                  {!isCurrentCardEditing && (
                    <TouchableOpacity style={styles.miniEditActionButton} onPress={() => startEditing(item)}>
                      <Text style={styles.miniEditActionText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  {!isCurrentCardEditing && (
                    <Text style={styles.accordionArrowIndicator}>
                      {isCardExpanded ? '▲' : '▼'}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* 👁️ Collapsible Accordion Content Window */}
              {isCardExpanded && (
                <>
                  <View style={styles.dividerLine} />

                  {/* Dynamic Exercises Form Layout */}
                  <View style={styles.exercisesMainWrapperBlock}>
                    {isCurrentCardEditing ? (
                      <>
                        <View style={styles.editTableHeaderRow}>
                          <Text style={[styles.tableHeaderLabel, { flex: 2 }]}>Exercise Name</Text>
                          <Text style={[styles.tableHeaderLabel, { flex: 0.5, textAlign: 'center' }]}>Sets</Text>
                          <Text style={[styles.tableHeaderLabel, { flex: 0.5, textAlign: 'center' }]}>Reps</Text>
                          <Text style={[styles.tableHeaderLabel, { flex: 0.6, textAlign: 'center' }]}>Weight</Text>
                          <Text style={[styles.tableHeaderLabel, { flex: 0.5, textAlign: 'right' }]}></Text> 
                        </View>

                        {editExercises.map((move, index) => (
                          <View key={index} style={styles.inlineExerciseFormRow}>
                            <TextInput 
                              style={[styles.inlineExerciseInput, { flex: 2 }]}
                              value={move.name}
                              onChangeText={(text) => handleExerciseNestedChange('name', text, index)}
                              placeholder="e.g., Squat"
                            />
                            <TextInput 
                              style={[styles.inlineExerciseInput, { flex: 0.5, textAlign: 'center' }]}
                              value={move.sets}
                              keyboardType="numeric"
                              onChangeText={(text) => handleExerciseNestedChange('sets', text, index)}
                              placeholder="Sets"
                            />
                            <TextInput 
                              style={[styles.inlineExerciseInput, { flex: 0.5, textAlign: 'center' }]}
                              value={move.reps}
                              keyboardType="numeric"
                              onChangeText={(text) => handleExerciseNestedChange('reps', text, index)}
                              placeholder="Reps"
                            />
                            <TextInput 
                              style={[styles.inlineExerciseInput, { flex: 0.6, textAlign: 'center' }]}
                              value={move.weight}
                              keyboardType="numeric"
                              onChangeText={(text) => handleExerciseNestedChange('weight', text, index)}
                              placeholder="kg"
                        />
                            <TouchableOpacity 
                              style={styles.rowDeleteActionBtn} 
                              onPress={() => removeExerciseInputFieldRow(index)}
                            >
                              <Text style={styles.rowDeleteActionText}>🗑️</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                        <TouchableOpacity style={styles.addMoveRowButton} onPress={addExerciseInputFieldRow}>
                          <Text style={styles.addMoveRowButtonText}>＋ Add Another Exercise Row</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.pillsStackContainer}>
                        {item.exercises && item.exercises.length > 0 ? (
                          item.exercises.map((move, index) => (
                            <View key={index} style={styles.exerciseMetricsCardPill}>
                              <Text style={styles.mainMovementNameText}>{move.name || "Unnamed Movement"}</Text>
                              <View style={styles.metricsBadgeDetailsTag}>
                                <Text style={styles.metricsBadgeString}>
                                  {move.sets || '0'}x{move.reps || '0'} {move.weight || '0'}kg
                                </Text>
                              </View>
                            </View>
                          ))
                        ) : (
                          <Text style={{ color: '#aaa', fontSize: 12, fontStyle: 'italic', paddingLeft: 4 }}>
                            No movements configured inside this template.
                          </Text>
                        )}
                      </View>
                    )}
                  </View>

                  {/* Footers */}
                  {isCurrentCardEditing ? (
                    <View style={styles.editingControlFooterStack}>
                      <View style={styles.editingControlsFooterRow}>
                        <TouchableOpacity style={[styles.footerControlBtn, styles.saveControlBtn]} onPress={() => saveCardChanges(item.id)}>
                          <Text style={styles.saveControlBtnText}>Save Template Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.footerControlBtn, styles.cancelControlBtn]} onPress={() => cancelCardChanges(item.id)}>
                          <Text style={styles.cancelControlBtnText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.templateDeleteEntireButton} 
                        onPress={() => handleDeleteEntireTemplate(item.id, item.title)}
                      >
                        <Text style={styles.templateDeleteEntireButtonText}>Delete Template Entirely</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.actionPromptRow}
                      onPress={() => handleLaunchTemplate(item.title)}
                    >
                      <Text style={styles.promptText}>Tap here to initialize routine split</Text>
                      <Text style={styles.arrowIcon}>→</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}

            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingTop: 24 },
  topControlMenuBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backLinkRow: { paddingVertical: 4 },
  backLinkText: { color: '#666666', fontSize: 13, fontWeight: '700' },
  addNewRoutineBtn: { backgroundColor: '#111111', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addNewRoutineBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111111' },
  subtitle: { fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 24, lineHeight: 18 },
  cardContainer: { marginBottom: 14 },
  templateCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#EAEAEA' },
  templateCardEditing: { borderColor: '#111111', borderWidth: 1.5, backgroundColor: '#FCFCFC' },
  
  // Custom Header Flex Setup
  cardHeaderRowClickable: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  colorBadgeIndicator: { width: 4, height: 32, borderRadius: 2 },
  templateTitle: { fontSize: 15, fontWeight: '800', color: '#111111' },
  templateFocus: { fontSize: 12, color: '#666666', marginTop: 2, fontWeight: '500' },
  
  headerRightControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accordionArrowIndicator: { fontSize: 10, color: '#94A3B8', width: 14, textAlign: 'center' },
  
  miniEditActionButton: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  miniEditActionText: { color: '#4B5563', fontSize: 11, fontWeight: '700' },
  dividerLine: { height: 1, backgroundColor: '#F5F5F5', marginVertical: 12 },
  pillsStackContainer: { flexDirection: 'column', gap: 6, marginBottom: 10 },
  exerciseMetricsCardPill: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  mainMovementNameText: { fontSize: 13, color: '#1E293B', fontWeight: '700' },
  metricsBadgeDetailsTag: { backgroundColor: '#111111', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  metricsBadgeString: { fontSize: 12, color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.3 },
  exercisesMainWrapperBlock: { marginBottom: 12 },
  editTableHeaderRow: { flexDirection: 'row', paddingHorizontal: 4, marginBottom: 6, gap: 6 },
  tableHeaderLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  inlineExerciseFormRow: { flexDirection: 'row', gap: 6, marginBottom: 6, alignItems: 'center' },
  inlineExerciseInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, fontWeight: '600', color: '#334155' },
  rowDeleteActionBtn: { paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' },
  rowDeleteActionText: { fontSize: 14 },
  addMoveRowButton: { backgroundColor: '#FFFFFF', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#CBD5E1', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  addMoveRowButtonText: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  inlineTextInputTitle: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 6, width: '90%' },
  inlineTextInputFocus: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 12, fontWeight: '500', color: '#475569', width: '90%' },
  actionPromptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  promptText: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  arrowIcon: { fontSize: 14, color: '#9CA3AF', fontWeight: 'bold' },
  editingControlFooterStack: { flexDirection: 'column', gap: 8, marginTop: 4 },
  editingControlsFooterRow: { flexDirection: 'row', gap: 8 },
  footerControlBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  saveControlBtn: { backgroundColor: '#22C55E' },
  saveControlBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  cancelControlBtn: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  cancelControlBtnText: { color: '#4B5563', fontSize: 12, fontWeight: '600' },
  templateDeleteEntireButton: { borderColor: '#EF4444', borderWidth: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  templateDeleteEntireButtonText: { color: '#EF4444', fontSize: 12, fontWeight: '700' }
});