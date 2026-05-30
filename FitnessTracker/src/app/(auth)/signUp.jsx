import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert
} from "react-native";

import { Link, router } from "expo-router";
import MyButton from "../../components/MyButton";
import MyTextInput from "../../components/MyTextInput";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function SignUp() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth()

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);

    if (result) {
      Alert.alert("Success", "Account created successfully");
      router.replace("/");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Start tracking your fitness progress today
      </Text>

      <MyTextInput
        style={{ marginBottom: 14 }}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <MyTextInput
        style={{ marginBottom: 14 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <MyTextInput
        style={{ marginBottom: 14 }}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <MyButton title="Sign Up" onPress={handleSignUp}/>

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