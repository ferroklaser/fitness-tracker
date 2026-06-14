import { View, Text, TouchableOpacity } from "react-native"

const LogCard = ({item, onDelete}) => {
    return (
        <View style={styles.historyItem}>
            <Text style={styles.itemTitle}>{item.exercise_name}</Text>
            <Text style={styles.itemDetails}>
                {item.sets} sets × {item.reps} reps × {item.weight} kg
            </Text>
            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => onDelete(item.id)} // Assumes your item has a unique 'id'
                activeOpacity={0.7}
            >
                <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = {
    itemTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
    itemDetails: { fontSize: 13, color: '#666', fontWeight: '500' },
    historyItem: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#EAEAEA', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    deleteButton: {
        padding: 10, // Makes the touch target larger and easier to hit
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: {
        fontSize: 18,
    }
}

export default LogCard