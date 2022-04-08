import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { StyleSheet, Dimensions } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { auth, firestore } from "../config";
import { LogBox } from "react-native";
import firebase from "firebase/app";
import uuid from "react-native-uuid";

export default function ChatScreen({ route, navigation }) {
  const { width, height } = Dimensions.get("screen");
  LogBox.ignoreLogs(["Setting a timer"]);
  const style = StyleSheet.create({
    container: {
      backgroundColor: "#3777f0",
      padding: 0.02 * height,
      margin: 10,
      borderRadius: 15,
      marginTop: 0.05 * width,
      width: 0.75 * width,
    },
    page: {
      flex: 1,
    },

    box: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "flex-end",
      marginBottom: width * 0.15,
    },
    header: {
      marginTop: width * 0.1,
      alignItems: "center",
      justifyContent: "space-between",
      height: height * 0.06,
      flexDirection: "row",
      padding: 10,
    },
    messageBtn: {},

    leftContainer: {
      backgroundColor: "#3777f0",
      marginLeft: 10,
      marginRight: "auto",
    },
    rightContainer: {
      backgroundColor: "lightgrey",
      marginRight: 10,
      marginLeft: "auto",
    },
    root: {
      flexDirection: "row",
      padding: 10,
    },
    icon: {
      marginHorizontal: 5,
    },
    input: {
      flex: 1,
      marginHorizontal: 5,
    },
    inputContainer: {
      backgroundColor: "#f2f2f2",
      flex: 1,
      marginRight: 10,
      borderRadius: 25,
      flexDirection: "row",
      borderColor: "#dedede",
      alignItems: "center",
    },
    buttonContainer: {
      width: 0.1 * width,
      height: 0.05 * height,
      backgroundColor: "#3777f0",
      borderRadius: 25,
      justifyContent: "center",
      alignContent: "center",
    },
    buttonText: {
      color: "white",
      fontSize: width * 0.08,
      marginLeft: width * 0.025,
    },
  });
  const { chatroomId } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({});
  const currentUserUID = auth?.currentUser.uid;
  const currentUserDoc = firestore.collection("users").doc(currentUserUID);
  const currentChatRoom = firestore.collection("chatrooms").doc(chatroomId);
  const messagesCollection = firestore.collection("messages");
  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

  const fetchMessages = () => {
    currentChatRoom.onSnapshot((snapshot) => {
      const latestMsgsId = snapshot.data().latest_msgs_id;
      // Scan from the tail of the latest Msgs list
      latestMsgsId.forEach((msgId) => {
        messagesCollection
          .where("_id", "==", msgId)
          .get()
          .then((msgSnapshot) => {
            msgSnapshot.forEach((msg) => {
              const formattedDate = msg
                .data()
                .sent_at.toDate()
                .toLocaleDateString("en-US")
                + " "
                + msg
                .data()
                .sent_at.toDate()
                .toLocaleTimeString("en-US");
              const msgData = {
                _id: msg.data()._id,
                sent_at: formattedDate,
                text: msg.data().content,
                sent_by: msg.data().sent_by,
              };
              setMessages((prevState) => [...prevState, msgData]);
            });
          })
          .catch((err) => console.log(err));
      });
    });
  };

  

  useEffect(() => {
    fetchMessages();
    return () => {
      setMessages([])
    }
  }, []);
  const onSend = () => {
    // Store message to the message collection
    const _id = uuid.v4();
    firestore.collection("messages").add({
      _id: _id,
      chatroom_id: chatroomId,
      content: message,
      sent_at: new Date(),
      sent_by: currentUserUID,
    });
    setMessages([])
    // Update the latest msgs array in the current chatroom
    firestore
      .collection("chatrooms")
      .doc(chatroomId)
      .update({
        latest_msgs_id: arrayUnion(_id),
      });
    setMessage('')
  };

  let handleChangeText = (text) => {
    setMessage(text);
  };
  return (
    <ScrollView style={style.page}>
      <View style={style.header}></View>
      <View style={style.box}>
        {/* Render message list */}
        {messages.map((mes, index) => {
          return (
            <View
              key={mes._id}
              style={[
                style.container,
                mes.sent_by == currentUserUID
                  ? style.leftContainer
                  : style.rightContainer,
              ]}
            >
              <Text style={{ color: "white" }}>{mes.sent_at}</Text>
              <Text style={{ color: "white" }}>{mes.text}</Text>
            </View>
          );
        })}
        {/* Message Input */}
        <View style={style.root}>
          <View style={style.inputContainer}>
            <TextInput
              onChangeText={(text) => handleChangeText(text)}
              style={style.input}
              placeholder="Signal message..."
            />
          </View>
          <TouchableOpacity
            onPress={() => onSend()}
            style={style.buttonContainer}
          >
            <Text style={style.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
