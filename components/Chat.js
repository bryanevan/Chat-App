import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Linking,
  Platform,
  View,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";


const Chat = ({ isConnected, db, route, navigation, storage }) => {
  // Destructure the parameters from the route object
  const { name, color, uid } = route.params;
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
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  };

  // callback to pass to the GiftedChat InputToolbar property. Check the state of isConnected bool, if false, don't render text input toolbar.
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
     else return null;
  };

  // callback function to be passed in the GiftedChat custom actions prop that returns a CustomAction component with relevant prop data. 
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} uid={uid} {...props} />;
  };

  // a custom view for handling messages sent explicitly with a location property, which triggers Expos MapView component in the render/return. The location object is sent in a special getLocation handler in CustomActions.js
  const renderCustomView = (props) => {
  const { currentMessage } = props;
  if (currentMessage.location) {
    return (
      <View style={{ borderRadius: 13, margin: 3 }}>
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          provider="google"
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={() => {
            if (Platform.OS === "android") {
              Linking.openURL(
                `geo:${currentMessage.location.latitude}, ${currentMessage.location.longitude}`
              );
            }
          }}
        />
      </View>
    );
  }
  return null;
};

  // Customize the appearance of the message bubble
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#333232"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  // Render the Chat component
  return (
    <View style={[ styles.container, {backgroundColor: color} ]}>
      <GiftedChat
        style={styles.textingBox}
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: uid,
          name,
        }}
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