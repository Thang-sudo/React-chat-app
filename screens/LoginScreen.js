import { View, Text} from 'react-native';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, Dimensions} from 'react-native';
import { auth } from '../config'
export default function LoginScreen({navigation}) {
  // States 
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const { width, height } = Dimensions.get("screen");
  // Style
  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
  },
  login:{
    backgroundColor: "#F4F5F7",
    alignContent:"flex-end",
    width: width * 0.9, 
    height: height * 0.5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
},
}) 

  // Event Handlers
  const onLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {    
            navigation.replace('MessageList')
        })
        .catch(error => {
            console.log(error);
        })
  }   

  const onRegistration = () => {
    navigation.navigate('Registration')
  }

  return (
    <View style={style.container}>
      <View style={style.login}>
        <TextInput
            placeholder='Enter your email'
            onChangeText={text=>setEmail(text)}
        />
        <TextInput
            placeholder='Enter your password'
            secureTextEntry
            onChangeText={text=>setPassword(text)}
        />
        <TouchableOpacity onPress={onLogin}>
            <Text>Login</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "center"}}>
              <Text > Don't have account? </Text>
              <TouchableOpacity>
                  <Text onPress={onRegistration}>Sign up</Text>
              </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
