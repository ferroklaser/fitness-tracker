import { Slot, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ProtectedLayout() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{ headerShown: false }}
      >
      </Stack>
    </SafeAreaView>
  );
}