import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAgCfnNHz6PQS3h8DDbu0iAriuqs_evf08",
    authDomain: "chat-app-ea8e3.firebaseapp.com",
    databaseURL: "https://chat-app-ea8e3.firebaseio.com",
    projectId: "chat-app-ea8e3",
    storageBucket: "chat-app-ea8e3.appspot.com",
    messagingSenderId: "836613250816",
    appId: "1:836613250816:web:6389efe673263f1fd29de5",
    measurementId: "G-Z8X0FW4TJH"
  };
  
  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const firestore = firebase.firestore()
  
  export { auth };
  export { firestore };