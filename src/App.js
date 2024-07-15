// src/App.js
import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Chat from './components/Chat';
import useUser from './Context/UserContext';
import setupUserPresenceListener from './components/StatusMonitoring';
// import loadAllMessages from './components/InitialSetUp';

function App() {
  const {user, setUser} = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        setUser(user);
        setupUserPresenceListener(user.uid);
        // loadAllMessages(user.uid);

      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? <Chat /> : <><Login /><SignUp /></>}
      {/* <><Login /><SignUp /></> */}
    </div>
  );
}

export default App;
