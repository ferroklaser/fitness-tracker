import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';

import MyTextInput from "./MyTextInput";

export function EntryLogger({ 
    exercise,
    setExercise,
    weight,
    setWeight,
    reps,
    setReps,
    onPress
}) {
    return (
        <>
            <Text style={styles.sectionTitle}>Quick Entry Logger</Text>
            <View style={styles.card}>
                <MyTextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Exercise name..." value={exercise} onChangeText={setExercise} />
                <View style={styles.row}>
                    <MyTextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
                    <MyTextInput style={[styles.input, { flex: 1 }]} placeholder="Reps" keyboardType="numeric" value={reps} onChangeText={setReps} />
                </View>
                <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
                    <Text style={styles.actionBtnText}>Save Log Entry</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 24 },
    input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 12, color: '#111' },
    row: { flexDirection: 'row', marginBottom: 4 },
    actionBtn: { backgroundColor: '#111', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    actionBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    sectionTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 16, paddingLeft: 4 },
})