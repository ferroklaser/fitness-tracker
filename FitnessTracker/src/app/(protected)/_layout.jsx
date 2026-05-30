import { Slot } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Redirect } from "expo-router";

export default function ProtectedLayout() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}