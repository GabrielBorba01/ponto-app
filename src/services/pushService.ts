import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const pushService = {
  // Inicializar push notifications
  async initPush(userId: string): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      console.log('Push notifications não disponíveis na web');
      return;
    }

    // Solicitar permissão
    let permStatus = await PushNotifications.checkPermissions();
    
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    
    if (permStatus.receive !== 'granted') {
      throw new Error('Permissão de notificação negada');
    }

    // Registrar para receber push
    await PushNotifications.register();

    // Listener para token
    await PushNotifications.addListener('registration', async (token: any) => {
      console.log('Push token:', token.value);
      // Salvar token no Firestore
      await pushService.saveToken(userId, token.value);
    });

    // Listener para erro no registro
    await PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Erro no registro push:', error);
    });

    // Listener para notificação recebida
    await PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Notificação recebida:', notification);
      alert(`Nova notificação: ${notification.title || 'Sem título'}`);
    });

    // Listener para notificação clicada
    await PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      console.log('Notificação clicada:', notification);
    });
  },

  // Salvar token no Firestore
  async saveToken(userId: string, token: string): Promise<void> {
    try {
      await setDoc(doc(db, 'tokens', userId), {
        token,
        updatedAt: new Date()
      });
      console.log('Token salvo no Firestore');
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  },

  // Remover listeners
  async removeListeners(): Promise<void> {
    await PushNotifications.removeAllListeners();
  }
};
