import 'firebase/auth';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/libs/client/firebase';

const useFirebaseUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        user.getIdTokenResult().then(result => {
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
