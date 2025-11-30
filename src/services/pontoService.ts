import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';

export interface Ponto {
  id?: string;
  userId: string;
  tipo: 'entrada' | 'saida';
  timestamp: Timestamp;
  latitude: number;
  longitude: number;
}

export const pontoService = {
  // Adicionar ponto
  async addPonto(
    userId: string, 
    tipo: 'entrada' | 'saida', 
    latitude: number, 
    longitude: number
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'pontos'), {
      userId,
      tipo,
      timestamp: Timestamp.now(),
      latitude,
      longitude
    });
    return docRef.id;
  },

  // Buscar pontos do usuário
  async getPontosByUser(userId: string): Promise<Ponto[]> {
    const q = query(
      collection(db, 'pontos'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const pontos: Ponto[] = [];
    querySnapshot.forEach((doc) => {
      pontos.push({
        id: doc.id,
        ...doc.data()
      } as Ponto);
    });
    // Ordenar localmente por timestamp desc
    return pontos.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
  },

  subscribePontosByUser(userId: string, callback: (pontos: Ponto[]) => void): () => void {
    const q = query(
      collection(db, 'pontos'),
      where('userId', '==', userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pontos: Ponto[] = [];
      snapshot.forEach((doc) => {
        pontos.push({ id: doc.id, ...doc.data() } as Ponto);
      });
      pontos.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      callback(pontos);
    }, (error) => {
      console.error('Erro no snapshot de pontos:', error);
    });
    return unsubscribe;
  }
};
