// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDD8jV9TLFNU24ig4Bc-lUQRPOJU1gwZUM",
  authDomain: "my-chat-app-6af34.firebaseapp.com",
  databaseURL: "https://my-chat-app-6af34-default-rtdb.firebaseio.com/",
  projectId: "my-chat-app-6af34",
  storageBucket: "my-chat-app-6af34.appspot.com",
  messagingSenderId: "635145137212",
  appId: "1:635145137212:web:aa08eaa6758f49da43a739"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

