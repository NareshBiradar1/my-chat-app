import { useState, useEffect } from 'react';
import { ref, push, onValue, update, set , get } from 'firebase/database';
import { auth , database } from '../firebase'; // Assuming you have 'auth' imported correctly
import useUser from '../Context/UserContext';

function ChatWindow() {
    const {selectedUserId} = useUser();
    const userId = selectedUserId;


  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(userId); // Replace with actual receiverId

  useEffect(()=>{
    setReceiverId(userId);
  },[userId])

  const sendMessage = async () => {
    const chatRef = ref(database, `chats/${auth.currentUser.uid}_${receiverId}`);
    const newMessageRef = push(chatRef);
  
    const userRef = ref(database, `users/${receiverId}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
  
        console.log("message is sending .... " + userData.isOnline);
  
        const messageStatus = userData.isOnline ? 'delivered' : 'sent';
  
        await set(newMessageRef, {
          senderId: auth.currentUser.uid,
          receiverId: receiverId,
          text: message,
          timestamp: Date.now(),
          status: messageStatus
        });
        
        setMessage('');
      } else {
        console.log('Receiver not found');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };
  

  useEffect(() => {
    setMessages([])
    // console.log(`chats/${auth.currentUser.uid}_${receiverId}`);
    const chatRef = ref(database, `chats/${auth.currentUser.uid}_${receiverId}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const chatMessages = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      console.log(chatMessages);
      setMessages(chatMessages);
    });

    // console.log(`chats/${receiverId}_${auth.currentUser.uid}`);
    // const chatRef2 = ref(database, `chats/${receiverId}_${auth.currentUser.uid}`);
    // onValue(chatRef2, (snapshot) => {
    //   const data = snapshot.val();
    //   const chatMessages = data ? Object.keys(data).map(key => ({
    //     id: key,
    //     ...data[key]
    //   })) : [];
    //   console.log(chatMessages);
    //   const AllMessages = [...messages, ...chatMessages];
    //   AllMessages.sort((a, b) => a.timestamp - b.timestamp);
    //   setMessages(AllMessages);
    // });

    // Update message status to delivered
    // const deliveredRef = ref(database, `chats/${receiverId}_${auth.currentUser.uid}`);
    // onValue(deliveredRef, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data) {
    //     Object.keys(data).forEach(key => {
    //       if (data[key].status === 'sent') {
    //         update(ref(database, `chats/${receiverId}_${auth.currentUser.uid}/${key}`), {
    //           status: 'delivered'
    //         });
    //       }
    //     });
    //   }
    // });
  }, [receiverId]);

//   const markAsRead = (messageId) => {
//     const messageRef = ref(database, `chats/${auth.currentUser.uid}_${receiverId}/${messageId}`);
//     update(messageRef, {
//       status: 'read'
//     });
//   };

  return (
    <div>
      <h2>Chat Window</h2>
      <div>
        {messages.map(msg => (
          <div key={msg.id} >
            <span>{msg.text}</span>
            <span>
              {msg.status === 'sent' && '✓'}
              {msg.status === 'delivered' && '✓✓'}
              {msg.status === 'read' && '✓✓ (blue)'}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatWindow;
