import { database } from '../firebase';
import { ref, onValue, set, serverTimestamp, onDisconnect, update } from "firebase/database";

const db = database;

function setupUserPresenceListener(userId) {
  console.log("updating function called");
  
  const lastOnlineRef = ref(db, `users/${userId}/lastTimeOnline`);
  const userStatusRef = ref(db, `users/${userId}/isOnline`);
  const connectedRef = ref(db, '.info/connected');

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      // Set user's online status to true
      set(userStatusRef, true);

      // Mark all messages as delivered where the current user is the receiver
      markMessagesAsDelivered(userId);

      // Handle actions on disconnection
      onDisconnect(userStatusRef).set(false);
      onDisconnect(lastOnlineRef).set(serverTimestamp());
    }
  });

  function markMessagesAsDelivered(userId) {
    console.log("came online " + userId);

    const chatsRef = ref(db, 'chats');
    onValue(chatsRef, (snapshot) => {
      const chats = snapshot.val();
      if (chats) {
        const updates = {};
        Object.keys(chats).forEach(chatId => {
          const chat = chats[chatId];

          console.log("new chat ....................");
          
          const allMessagesRef = ref(db, `chats/${chatId}`);
          onValue(allMessagesRef, (messagesSnapshot) => {
            const allMessages = messagesSnapshot.val();
            if (allMessages) {
              Object.keys(allMessages).forEach(messageId => {
                const message = allMessages[messageId];
                if (message.receiverId === userId && message.status === 'sent') {
                  updates[`chats/${chatId}/${messageId}/status`] = 'delivered';
                }
              });

              if (Object.keys(updates).length > 0) {
                update(ref(db), updates)
                  .then(() => console.log('Message statuses updated to delivered'))
                  .catch(error => console.error('Error updating message statuses: ', error));
              }
            }
          });
        });
      }
    });
  }
}

export default setupUserPresenceListener;
