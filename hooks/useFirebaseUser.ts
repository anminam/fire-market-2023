import 'firebase/auth';
import { useEffect, useState } from 'react';
import { User, getAuth } from 'firebase/auth';
import { app } from '@/libs/client/firebase';
const auth = getAuth(app);

const useFirebaseUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        user.getIdTokenResult().then((result) => {
          setToken(result.token);
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { currentUser, token };
};

export default useFirebaseUser;
