import { ThemedView } from "@/components/ThemedView";
import { useSessionContext } from "@/context/session-context";
import { useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RawButton } from "react-native-gesture-handler";

export default function SignIn() {
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const { signIn } = useSessionContext();
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/logo technopartner.png")}
        style={styles.image}
      />
      <View
        style={{
          marginTop: 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ThemedView style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => {
              setState({
                ...state,
                username: text,
              });
            }}
          />
        </ThemedView>
        <ThemedView style={{ ...styles.inputContainer, marginTop: 16 }}>
          <Text>Password</Text>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            onChangeText={(text) => {
              setState({ ...state, password: text });
            }}
          />
        </ThemedView>
        <Pressable
          onPress={async () => {
            await signIn(state.username, state.password);
          }}
          style={styles.button}
        >
          <Text>Login</Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height,
    backgroundColor: "#ffffff",
  },
  image: {
    width: Dimensions.get("window").width * 0.8,
    // backgroundColor: "#000",
    height: 100,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  textInput: {
    marginTop: 8,
    width: Dimensions.get("window").width * 0.6,
    backgroundColor: "#ffffff",
    elevation: 1,
    padding: 10,
    borderRadius: 12,
  },
  button: {
    width: Dimensions.get("window").width * 0.4,
    display: "flex",
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    elevation: 1,
    borderRadius: 12,
  },
});
