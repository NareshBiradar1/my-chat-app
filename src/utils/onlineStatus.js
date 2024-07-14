// src/utils/onlineStatus.js
import { database } from '../firebase';
import { ref, onDisconnect, onValue, set } from 'firebase/database';
import { auth } from '../firebase';

export const setUserOnlineStatus = (uid) => {
  const userStatusDatabaseRef = ref(database, `/users/${uid}/online`);

  onValue(ref(database, `.info/connected`), (snapshot) => {
    if (snapshot.val() === false) {
      return;
    }

    onDisconnect(userStatusDatabaseRef).set(false).then(() => {
      set(userStatusDatabaseRef, true);
    });
  });
};
