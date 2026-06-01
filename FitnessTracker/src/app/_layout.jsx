import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext"; // 🌐 1. Import your new onboarding context file

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider> {/* 🧬 2. Nest the UserProvider here */}
        <Stack screenOptions={{ headerShown: false }} />
      </UserProvider>
    </AuthProvider>
  );
}