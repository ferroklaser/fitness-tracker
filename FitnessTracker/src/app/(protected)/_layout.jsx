import { Slot } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Redirect } from "expo-router";

// 🛠️ DEV BYPASS KEY: Forces the app to let you straight into your dashboard preview
const IS_DEV_PREVIEW = true;

export default function ProtectedLayout() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return null;
  }

  // If we are designing the UI, ignore the empty user profile and bypass the wall
  if (!user && !IS_DEV_PREVIEW) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}