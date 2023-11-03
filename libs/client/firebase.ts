import { initializeApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function normalLogin() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  if (auth.currentUser) {
    const { displayName, email, uid } = auth.currentUser;
    const token = await auth.currentUser.getIdToken();

    return { email, uid, token };
  }

  return null;
}

export { app, auth, normalLogin };
