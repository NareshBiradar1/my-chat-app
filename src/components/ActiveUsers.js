// src/components/ActiveUsers.js
import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

function ActiveUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const onlineUsers = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).filter(user => user.online);

      setUsers(onlineUsers);
    });
  }, []);

  return (
    <div>
      <h2>Active Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ActiveUsers;
