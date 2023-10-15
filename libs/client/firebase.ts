import { initializeApp } from 'firebase/app';
import { FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

const app: FirebaseApp = initializeApp(firebaseConfig);

export { app };
