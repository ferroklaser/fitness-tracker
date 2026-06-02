import { ActionCard } from "@/components/ActionCard"
import { StyleSheet, Text } from "react-native"
import { useRouter } from "expo-router"

export function ActionCardList() {
    const router = useRouter()
    
    return (
        <>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <ActionCard
                title="Start Empty Workout"
                description="Log training on the fly"
                emoji="🏋️‍♂️"
                onPress={() => router.push('/workout/active')} />

            <ActionCard
                title="AI Recommendation"
                description="Custom splits for your goals"
                emoji="🧠"
                onPress={() => router.push('/ai-coach')}
            />

            <ActionCard
                title="Saved Workouts"
                description="Run your template splits"
                emoji="📂"
                onPress={() => router.push('/workout/saved')}
            />
        </>
    )
}

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 11, fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 16, paddingLeft: 4 },
})