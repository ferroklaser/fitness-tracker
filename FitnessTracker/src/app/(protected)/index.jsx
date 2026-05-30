import { Text, View, StyleSheet } from "react-native";
import MyButton from "../../components/MyButton";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut();
      // Your layout guard in (app)/_layout.js will automatically 
      // detect that user is now null and redirect to /login
    } catch (error) {
      console.log("Error testing sign out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <MyButton title={"sign out"} onPress={handleSignOut}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
