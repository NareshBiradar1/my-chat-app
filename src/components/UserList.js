// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import {ref, onValue } from 'firebase/database';
import { database } from '../firebase';

function UserList() {
  const [users, setUsers] = useState([]);

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

  return (
    <div>
      <h3>Active Users</h3>
      <div>
        {users.map((user) => (
          <div key={user.id} onClick={() => onUserClick(user.id)} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}>
            {user.displayName}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
