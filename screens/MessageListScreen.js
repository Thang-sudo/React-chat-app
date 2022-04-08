import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  LogBox,
  SnapshotViewIOSBase,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, firestore } from "../config";
import { NavigationContainer } from "@react-navigation/native";
import HeadlessJsTaskError from "react-native/Libraries/ReactNative/HeadlessJsTaskError";
export default function MessageListScreen({ navigation }) {
  LogBox.ignoreLogs(["Setting a timer"]);
  const { width, height } = Dimensions.get("screen");
  const style = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: height / 12,
    },

    page: {
      backgroundColor: "white",
      flex: 1,
    },

    navbar: {
      flexDirection: "row",
      backgroundColor: "#f2f2f2",
      height: 50,
      marginTop: 615,
      backgroundColor: "#F4BCD9",
    },

    logoutBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#FF1493",
      backgroundColor: "#FFFFFF",
    },

    messageBtn: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    homeBtn: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    profileBtn: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    avatar: {
      width: width / 4.5,
      height: height / 10,
      borderRadius: 40,
      marginRight: width / 20,
      marginLeft: width / 20,
    },

    badgeContainer: {
      backgroundColor: "blue",
      width: width / 15,
      height: height / 30,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "white",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      left: width / 4.75,
    },

    badgeText: {
      color: "white",
    },

    rightContainer: {
      flex: 1,
      marginTop: width / 25,
      marginRight: width / 25,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    name: {
      fontWeight: "bold",
      fontSize: width / 20,
      marginBottom: width / 25,
    },
    text: {
      color: "grey",
      fontSize: width / 25,
    },
  });
  const [chatRoomsList, setChatRoomsList] = useState([]);
  const usersCollection = firestore.collection("users");
  const currentUser = auth?.currentUser.uid;
  const chatroomsCollection = firestore.collection("chatrooms");
  const messagesCollection = firestore.collection("messages");

  const fecthChatRooms = () => {
    // Get all the chatrooms that contain the user's id
    chatroomsCollection
      .where("users_id", "array-contains", currentUser)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const partnerId = doc
            .data()
            .users_id.filter((user) => user != currentUser);
          usersCollection
            .doc(partnerId[0])
            .get()
            .then((partner) => {
              let latest_msgs_id = doc.data().latest_msgs_id;
              // Fetch latest message
              messagesCollection
                .where("_id", "==", latest_msgs_id[latest_msgs_id.length - 1])
                .get()
                .then(snapshot => {
                  snapshot.docs.map((mes) => {
                    const timestamp = mes.data().sent_at;
                    const jsDate = timestamp.toDate();
                    const formattedDate =
                      jsDate.toLocaleDateString("en-US") +
                      " " +
                      jsDate.toLocaleTimeString("en-US");
                    const lastMsgData = {
                      sent_at: formattedDate,
                      content: mes.data().content,
                    };
        
                    const data = {
                      partnerId: partnerId[0],
                      partnerName: partner.data().userName,
                      chatroomId: doc.data().id,
                      latestMsg: lastMsgData,
                      imageURL: partner.data().imageURL,
                    };
                    setChatRoomsList((prevState) => [...prevState, data]);
                  })
                })
                .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((error) => console.log(error));
  };
      
  const onChat = (chatroomId) => {
    navigation.navigate("Chat", { chatroomId });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setChatRoomsList([]);
      fecthChatRooms();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fecthChatRooms();
    return () => {
      setChatRoomsList([]);
    };
  }, []);
  const renderedChatRoomlist = () => {
    return chatRoomsList.map((chatRoom, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={style.container}
          onPress={() => onChat(chatRoom.chatroomId)}
        >
          <Image style={style.avatar} source={{ uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTML%2FElement%2Fimg&psig=AOvVaw1crntiWnnDdLft91p---Lk&ust=1648265801509000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCPjEqN-q4PYCFQAAAAAdAAAAABAK'}} />
          <View style={style.rightContainer}>
            <View style={style.row}>
              <Text style={style.name}> {chatRoom.partnerName} </Text>
              <Text style={style.text}>{chatRoom.latestMsg.sent_at}</Text>
            </View>
            <Text numberOfLines={1} style={style.text}>
              {" "}
              {chatRoom.latestMsg.content}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return <View>{renderedChatRoomlist()}</View>;
}
