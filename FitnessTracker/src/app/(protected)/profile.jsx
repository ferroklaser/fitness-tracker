import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function Profile() {
  const username = "Leo";
  const email = "leo@email.com";
  const weight = "78.5 kg";
  const height = "180 cm";

  const handleSignOut = () => {
    Alert.alert("🚪 Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => Alert.alert("Session Cleared", "Supabase state removed.") }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>User Profile</Text>
      <Text style={styles.subtitle}>View your verified account profile variables below.</Text>

      {/* Structured Card Deck */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Account Name</Text>
          <Text style={styles.value}>{username}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Weight</Text>
          <Text style={styles.value}>{weight}</Text>
        </View>
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Height Baseline</Text>
          <Text style={styles.value}>{height}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAFAFA', padding: 20, paddingTop: 32 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 24 },
  card: { backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 28 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', alignItems: 'center' },
  label: { fontSize: 13, color: '#666', fontWeight: '500' },
  value: { fontSize: 14, color: '#111', fontWeight: '700' },
  button: { borderColor: '#EF4444', borderWidth: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
});