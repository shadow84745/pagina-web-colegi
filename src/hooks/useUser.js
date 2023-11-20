// hooks/useUser.js
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ajusta la ruta según la estructura de tu proyecto

const useUser = (userId) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  return user;
};

export default useUser;
