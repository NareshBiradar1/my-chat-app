// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, push, onValue, update , set } from 'firebase/database';
import { auth } from '../firebase';
import UserList from './UserList';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('receiver-id'); // Replace with actual receiverId

  const sendMessage = () => {
    const chatRef = ref(database, `chats/${auth.currentUser.uid}_${receiverId}`);
    const newMessageRef = push(chatRef);
    set(newMessageRef, {
      senderId: auth.currentUser.uid,
      receiverId: receiverId,
      text: message,
      timestamp: Date.now(),
      status: 'sent'
    });
    setMessage('');
  };

  useEffect(() => {
    const chatRef = ref(database, `chats/${auth.currentUser.uid}_${receiverId}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const chatMessages = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      setMessages(chatMessages);
    });

    // Update message status to delivered
    const deliveredRef = ref(database, `chats/${receiverId}_${auth.currentUser.uid}`);
    onValue(deliveredRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach(key => {
          if (data[key].status === 'sent') {
            update(ref(database, `chats/${receiverId}_${auth.currentUser.uid}/${key}`), {
              status: 'delivered'
            });
          }
        });
      }
    });
  }, [receiverId]);

  const markAsRead = (messageId) => {
    const messageRef = ref(database, `chats/${auth.currentUser.uid}_${receiverId}/${messageId}`);
    update(messageRef, {
      status: 'read'
    });
  };

//   return (
//     <div>
//       <h2>Chat</h2>
//       <div>
//         {messages.map(msg => (
//           <div key={msg.id} onClick={() => markAsRead(msg.id)}>
//             <span>{msg.text}</span>
//             <span>
//               {msg.status === 'sent' && '✓'}
//               {msg.status === 'delivered' && '✓✓'}
//               {msg.status === 'read' && '✓✓ (blue)'}
//             </span>
//           </div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
     return(
        <UserList/>
     );

}

export default Chat;
