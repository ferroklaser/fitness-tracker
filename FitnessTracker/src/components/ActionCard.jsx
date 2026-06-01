import { 
    StyleSheet,
    TouchableOpacity,
    Text,
    View
 } from "react-native"


export function ActionCard({title, description, emoji, onPress, ... props}) {
    return (
        <TouchableOpacity style={styles.actionCard} onPress={onPress}>
            <View style={styles.cardInfo}>
                <Text style={styles.cardEmoji}>{emoji}</Text>
                <View style={styles.textGroup}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDesc}>{description}</Text>
                </View>
            </View>
            <Text style={styles.arrowIcon}>➔</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    actionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 16, padding: 18, marginBottom: 12 },
    primaryCard: { backgroundColor: '#111', borderColor: '#111' },
    cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 0.9 },
    cardEmoji: { fontSize: 26, marginRight: 14 },
    textGroup: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
    cardDesc: { fontSize: 12, color: '#666', marginTop: 2 },
    whiteText: { color: '#FFF' },
    lightText: { color: '#A1A1AA' },
    arrowIcon: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    arrowIconLight: { color: '#B1B1B1', fontSize: 16, fontWeight: '600' },
})