import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";

import { Link } from "expo-router";
import Button from "../../components/Button";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Log in to continue your fitness journey
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

      <Button title="Log In" />

      <Link href="/signUp" asChild>
        <Pressable>
          <Text style={styles.footer}>
            Don’t have an account?{" "}
            <Text style={styles.footerLink}>Sign up</Text>
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