import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDD8jV9TLFNU24ig4Bc-lUQRPOJU1gwZUM",
  authDomain: "my-chat-app-6af34.firebaseapp.com",
  projectId: "my-chat-app-6af34",
  storageBucket: "my-chat-app-6af34.appspot.com",
  messagingSenderId: "635145137212",
  appId: "1:635145137212:web:aa08eaa6758f49da43a739",
  databaseUrl: "https://my-chat-app-6af34-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;