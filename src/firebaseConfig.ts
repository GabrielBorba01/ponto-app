import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// Substitua pelos dados do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCLoZs6y5ukNOwSDyhvIsdzcjueT1lc3gM",
  authDomain: "ponto-app-79536.firebaseapp.com",
  projectId: "ponto-app-79536",
  storageBucket: "ponto-app-79536.firebasestorage.app",
  messagingSenderId: "945091327016",
  appId: "1:945091327016:web:67979fa59740783605f11d"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

// Messaging (apenas para web)
let messaging: any = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.log('Messaging not supported:', error);
  }
}

export { messaging };
