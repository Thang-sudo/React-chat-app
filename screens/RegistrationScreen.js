import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { auth, firestore } from '../config'
export default function RegistrationScreen({navigation}) {
  const { width, height } = Dimensions.get("screen");
  const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    interactiveBoxes: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F5F7",
        justifyContent:"space-evenly",
        width: width * 0.9, 
        height: height * 0.55,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
  })
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [userName, setUserName] = useState('')

  const onSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password1)
        .then(userCredentials => {
            const user = userCredentials.user 
            const data = {
                id: user.uid,
                email: user.email,
                imageUrl: imageUrl,
                userName: userName
            }
            // Get 'users' collection from firestore
            const usersRef = firestore.collection('users')
            usersRef
                .doc(user.uid)
                .set(data)
                .then(() => {
                    console.log(data)
                    navigation.navigate('MessageList')
                })
                .catch(error => {
                    alert(error)
                })
        })
        .catch(error => alert(error.message))
  }

  // Navigate to Login Screen
  const onLogin = () => {
    navigation.navigate('Login')
  }
  return (
    <View style={style.container}>
    <View  style={style.interactiveBoxes}>
    <TextInput
          placeholder='Enter your email'
          onChangeText={text=>setEmail(text)}
      />
      <TextInput
          placeholder='Enter your password'
          secureTextEntry
          onChangeText={text=>setPassword1(text)}
      />
      <TextInput
          placeholder='Enter your image url'
          onChangeText={text=>setImageUrl(text)}
      />
      <TextInput
          placeholder='Enter your user name'
          secureTextEntry
          onChangeText={text=>setUserName(text)}
      />
      <TouchableOpacity onPress={onSignUp}>
          <Text>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogin}>
          <Text>Login</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}
