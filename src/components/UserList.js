// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import {ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import ChatWindow from './ChatWindow';
import useUser from '../Context/UserContext';

function UserList() {
  const [users, setUsers] = useState([]);
  const {selectedUserId, setSelectedUserId} = useUser();

  useEffect(() => {
    const db = database;
    const usersRef = ref(db, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const usersList = [];
      for (let id in usersData) {
        usersList.push({ id, ...usersData[id] });
      }
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, []);

//   const handleUserClick = (userId) => {
//     console.log("Selected user ID:", userId);

//     // setSelectedUserId(userId);
//     // You can now use the selected user ID to fetch user-specific data or open a chat window, etc.
//   };

  return (
    <div>
      <h3>Active Users</h3>
      {/* <div> */}
        {users.map((user) => (
            // const suffix="";
          <div key={user.id} onClick={() => setSelectedUserId(user.id)} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}>
            {user.displayName}
          </div>
    ))}
      {/* </div> */}
        {/* { selectedUserId!==null && <div>
            
            <ChatWindow userId={selectedUserId}/>
        </div> } */}


    </div>
  );
}

export default UserList;
