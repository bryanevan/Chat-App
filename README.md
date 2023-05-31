# React Native Chat App built using Expo development platform and Google Firebase and Firestore
------------------------------------------------------------------------------------------------
# Tools and Platforms 

- React Native - front end framework
- Expo - native app development platform
- Android Studio - mobile development environemnt with Emulator
- Google Firebase - non-relational database for storing messages. 
- Google Firestore - storage solution for media based chat messages. 

# Key Features: 

- A page where users can enter their name and choose a background color for the chat screen before joining the chat .
- A page displaying the conversation, as well as an input field and submit button.
- The app leverages firebase's anonymous sign in feature to generate and record user ID/ message authors.
- Utilizes React Navigation to switch between two views, Start screen and a Chat screen.
- Data stored online and offline.

# Setting up the development environment:

- Clone the repository: git clone https://github.com/bryanevan/Chat-App

# EXPO 
- Install Expo CLI as a global npm package: npm add global expo-cli
- Create an account and log in at https://expo.dev/.
- Follow expo CLI's instructions.
- Install the Expo Go app on your phone (for testing purposes)
- Start the project: npx expo start 
- Scan the QR code provided in your terminal

# FIREBASE/ FIRESTORE
- follow new project workflow within Firebase console
- include Firebase object within App.js and/or separate file. 
- make a reference to the project using firebase config obj. 

# Dependencies:

    "@react-native-async-storage/async-storage": "1.17.11",
    "@react-native-community/netinfo": "9.3.7",
    "@react-navigation/native": "^6.1.6",
    "@react-navigation/native-stack": "^6.9.12",
    "expo": "^48.0.10",
    "expo-image-picker": "~14.1.1",
    "expo-location": "~15.1.1",
    "expo-media-library": "~15.2.3",
    "expo-status-bar": "~1.4.4",
    "firebase": "^9.13.0",
    "react": "18.2.0",
    "react-native": "^0.71.8",
    "react-native-gifted-chat": "^2.0.1",
    "react-native-maps": "1.3.2",
    "react-native-safe-area-context": "4.5.0",
    "react-native-screens": "~3.20.0",
    "react-native-svg": "^13.4.0"
 