import React from "react";
import { View, Text, Button } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: this.props.route.params.color,
      messages: [],

    };
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCxrfZ5Lq0B4fCljLEbavCtfMYqSRsNBg0",
        authDomain: "chatapp-9b384.firebaseapp.com",
        projectId: "chatapp-9b384",
        storageBucket: "chatapp-9b384.appspot.com",
        messagingSenderId: "511503300629",
        appId: "1:511503300629:web:fe2fd53e1dae7214c7361c",
        measurementId: "G-Q6BR2QMYC5",
      });
    }
    this.referenceMessagesUser = null;
    this.addMessage = this.addMessage.bind(this);
  }
  onCollectionUpdate = (querySnapshot) => {
   const messages = [];
   // go through each document
   querySnapshot.forEach((doc) => {
     // get the QueryDocumentSnapshot's data
     let data = doc.data();
     messages.push({
       _id: data._id,
       text: data.text,
       createdAt: data.createdAt.toDate(),
       user: data.user,
     });
   });
   this.setState({ messages });
  };

   // save message to Firestore
   addMessage = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  };
  componentDidMount() {
     // creating a references to shoppinglists collection
     this.referenceMessages = firebase
     .firestore()
     .collection("messages");
   
    
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name, backgroundColor: color });

// listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user?.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  };

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessage();
    }
    );
  };

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeListUser();
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.state.backgroundColor }}>
        <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}