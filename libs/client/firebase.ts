import { initializeApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
