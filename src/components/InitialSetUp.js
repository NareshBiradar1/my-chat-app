import useUser from '../Context/UserContext';
import {ref, onValue , set } from 'firebase/database';
import { database } from '../firebase';

const updateUserStatus = (userId, status) => {
    const userStatusRef = database.ref(`users/${userId}/status`);
    userStatusRef.set(status);
  };
  
  const syncMessages = (chatId, userId) => {
    const messagesRef = database.ref(`messages/${chatId}`);
    messagesRef.once('value', (snapshot) => {
      const messages = snapshot.val();
      const updates = {};
      for (const messageId in messages) {
        if (messages[messageId].receiverId === userId && messages[messageId].status === 'sent') {
          updates[`/messages/${chatId}/${messageId}/status`] = 'delivered';
        }
      }
      database.ref().update(updates);
    });
  };
  

const loadAllMessages = (userId) => {
    updateUserStatus(userId, 'online');
    syncMessages('chatId123', userId);
}

export default loadAllMessages;
  
  