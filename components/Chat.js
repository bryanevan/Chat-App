import { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ isConnected, db, route, navigation }) => {
  // Destructure the parameters from the route object
  const { name, color, userID } = route.params;

  // Set the initial state for messages
  const [messages, setMessages] = useState([]);

  let unsubMessages;

  useEffect(() => {
    // Set navigation options for the title
    navigation.setOptions({ title: name });

    // Check if connected to the internet
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // Create a query to fetch messages from the Firestore collection
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      // Subscribe to real-time updates using onSnapshot
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];

        // Process each document and create a new message object
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });

        // Cache the messages and update the state
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      // Load cached messages if not connected
      loadCachedMessages();
    }

    // Clean up the subscription when the component unmounts
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  // Load messages from AsyncStorage cache
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // Cache messages in AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Add a new message to Firestore
  const addMessagesItem = async (newMessage) => {
    const newMessageRef = await addDoc(
      collection(db, "messages"),
      newMessage[0]
    );
    if (!newMessageRef.id) {
      Alert.alert(
        "There was an error sending your message. Please try again later"
      );
    }
  };

  // Handle sending a new message
  const onSend = (newMessages) => {
    addMessagesItem(newMessages);
  };

  // Render the input toolbar if connected
  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
    }
  };

  // Customize the appearance of the message bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color:
              (color === "white") | (color === "yellow") ? "black" : "white",
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: color,
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  // Render the Chat component
  return (
    <View style={styles.container}>
      <GiftedChat
        style={styles.textingBox}
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
        }}
        name={{ name: name }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textingBox: {
    flex: 1,
  },
});

export default Chat;