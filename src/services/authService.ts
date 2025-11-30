import { auth } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';

export const authService = {
  // Criar conta
  async cadastrar(email: string, senha: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  },

  // Login
  async login(email: string, senha: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  },

  // Logout
  async logout(): Promise<void> {
    await signOut(auth);
  },

  // Usuário atual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};
