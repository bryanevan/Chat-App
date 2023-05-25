import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  onAuthStateChanged,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
import { Alert } from "react-native";

// An object of objects. When referenced in a "style" attribute, the backgroundColor is applied!
const Start = ({ navigation }) => {
  // Set initial state for text and color inputs
  const [text, setText] = useState("");
  const [color, setColor] = useState("");
  const auth = getAuth();

  const bgColors = {
    mint: { backgroundColor: "#36FFAD" },
    blue: { backgroundColor: "#65CEFF" },
    purple: { backgroundColor: "#9871EB" },
    pink: { backgroundColor: "#FD77FF" },
  };

  const { mint, blue, purple, pink } = bgColors;

  // Function to sign in the user anonymously
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        // Navigate to the Chat screen with user ID, name, and color
        navigation.navigate("Chat", {
          userID: result.user.uid,
          name: text ? text : "User",
          color: color ? color : "white",
        });
        Alert.alert("Signed in successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      });
  };

  return (
    <ImageBackground
      source={require("../assets/back_img.png")}
      style={[styles.container, styles.columnEvenlyCenter]}
    >
      <Text style={styles.title}>Chat Away!</Text>

      <View style={[styles.nameInput__container, styles.columnEvenlyCenter]}>
        <TextInput
          style={styles.nameInput__input}
          onChangeText={setText}
          placeholder="Enter your Name"
        />

        <View style={styles.colorSelect}>
          <Text style={styles.colorSelect__text}>Choose your Background:</Text>
          <View style={styles.colorSelect__dotsWrapper}>
            <TouchableOpacity
              style={[styles.colorSelect__dot, mint]}
              onPress={() => setColor("#36FFAD")}
            />

            <TouchableOpacity
              style={[styles.colorSelect__dot, blue]}
              onPress={() => setColor("#65CEFF")}
            />

            <TouchableOpacity
              style={[styles.colorSelect__dot, purple]}
              onPress={() => setColor("#9871EB")}
            />

            <TouchableOpacity
              style={[styles.colorSelect__dot, pink]}
              onPress={() => setColor("#FD77FF")}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.fauxButton}>
          <Text
            onPress={signInUser}
            style={[styles.colorSelect__text, styles.fauxButton__text]}
          >
            Start Chatting
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnEvenlyCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "600",
  },
  nameInput__container: {
    height: "44%",
    minHeight: 200,
    width: "88%",
  },
  nameInput__input: {
    height: 50,
    width: "88%",
    paddingLeft: 20,
    borderColor: "#fff",
    borderWidth: 1,
    color: "#fff",
    opacity: 50,
    fontSize: 16,
    fontWeight: "300",
  },
  colorSelect: {
    height: 75,
  },
  colorSelect__text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    opacity: 100,
  },
  colorSelect__dotsWrapper: {
    flexDirection: "row",
  },
  colorSelect__dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },
  colorSelect__dotSelected: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#5f5f5f",
  },
  fauxButton: {
    backgroundColor: "#757083",
    justifyContent: "center",
    width: "88%",
    padding: 16,
  },
  fauxButton__text: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Start;