// src/components/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import useUser from '../Context/UserContext';
import { serverTimestamp } from 'firebase/database';
import setupUserPresenceListener from './StatusMonitoring';
// import loadAllMessages from './/InitialSetUp';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser} = useUser();

  const handleLogin = () => {
    
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        const { uid } = user;

        const newUser = {
            id : uid,
            name : user.displayName,
            isOnline: true,
            lastTimeOnline: serverTimestamp(),
        }
        setUser(newUser); 
        setupUserPresenceListener(uid);
        // loadAllMessages(uid);
    //    console.log(userCredential.user);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
