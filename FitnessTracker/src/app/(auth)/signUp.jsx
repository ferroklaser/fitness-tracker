import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";

import { Link } from "expo-router";
import Button from "../../components/Button";

export default function SignUp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Start tracking your fitness progress today
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
      />

      <Button title="Sign Up" />

      <Link href="/login" asChild>
        <Pressable>
          <Text style={styles.footer}>
            Already have an account?{" "}
            <Text style={styles.footerLink}>Log in</Text>
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    fontSize: 16,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#6B7280",
  },

  footerLink: {
    color: "#2563EB",
    fontWeight: "700",
  },
});