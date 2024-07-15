// src/components/SignUp.js
import React, { useState } from 'react';
import { auth, database } from '../firebase'; // Assuming you have initialized Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set , serverTimestamp} from 'firebase/database'; // Import the ref and set methods
import useUser from '../Context/UserContext';



function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const {setUser} = useUser();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        const { uid } = user;

        const newUser = {
            id : uid,
            name : displayName,
            isOnline: true,
            lastTimeOnline: serverTimestamp()
        }
        
        setUser(newUser);
        saveUserData(uid, displayName, email);
        
      })
      .catch(error => {
        console.error(error);
      });
  };

  const saveUserData = (uid, displayName, email) => {
    const db = database;
    set(ref(db, 'users/' + uid), {
      displayName: displayName,
      email: email,
      isOnline: true,
      lastTimeOnline: serverTimestamp(),
      // Add more fields as needed
    }).then(() => {
      console.log("User data saved successfully.");
    }).catch((error) => {
      console.error("Error saving user data:", error.message);
    });
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display Name" />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}

export default SignUp;
