import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";
import { getStorage } from "firebase/storage";

// init the Stack object for the two main views, Start and Chat. 
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// init firebase and connect to firestore and access storage
const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCxrfZ5Lq0B4fCljLEbavCtfMYqSRsNBg0",
    authDomain: "chatapp-9b384.firebaseapp.com",
    projectId: "chatapp-9b384",
    storageBucket: "chatapp-9b384.appspot.com",
    messagingSenderId: "511503300629",
    appId: "1:511503300629:web:fe2fd53e1dae7214c7361c",
    measurementId: "G-Q6BR2QMYC5",
  };

  const connectionStatus = useNetInfo();  // Network connection status using useNetInfo hook
  const app = initializeApp(firebaseConfig); // Init Cloud Firestore
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start' screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name='Start' component={Start} options={{ headerShown: false }} />
        <Stack.Screen name="Chat">
          {(props) => (<Chat isConnected={connectionStatus.isConnected}
                             db={db}
                             storage={storage}
                             {...props} />)}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;