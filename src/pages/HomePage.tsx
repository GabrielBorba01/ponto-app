import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonLoading,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { authService } from '../services/authService';
import { pontoService, Ponto } from '../services/pontoService';
import { pushService } from '../services/pushService';
import './HomePage.css';

interface HomePageProps {
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [userEmail, setUserEmail] = useState('');

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setUserEmail(user.email || '');
      // Assinatura em tempo real
      unsubscribeRef.current = pontoService.subscribePontosByUser(user.uid, (lista) => {
        setPontos(lista);
      });
      // Inicializar push notifications (ignorar erro)
      pushService.initPush(user.uid).catch(err => {
        console.error('Erro ao inicializar push:', err);
      });
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const carregarPontos = async (userId: string) => {
    // Mantido para chamada manual se necessário; assinatura já atualiza automaticamente
    try {
      const pontosList = await pontoService.getPontosByUser(userId);
      setPontos(pontosList);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
    }
  };

  const registrarPonto = async (tipo: 'entrada' | 'saida') => {
    setLoading(true);
    
    try {
      // Obter localização
      // Verificar/permissão de localização
      try {
        const perm = await Geolocation.checkPermissions();
        if (perm.location !== 'granted') {
          await Geolocation.requestPermissions();
        }
      } catch (e) {
        console.warn('Falha ao checar permissões de localização:', e);
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000
      });

      const { latitude, longitude } = position.coords;

      // Salvar no Firestore
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await pontoService.addPonto(user.uid, tipo, latitude, longitude);

      alert(`Ponto de ${tipo} registrado com sucesso!`);

      // Assinatura em tempo real já atualiza; opcional forçar recarregar:
      // await carregarPontos(user.uid);
    } catch (error: any) {
      alert('Erro ao registrar ponto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const user = authService.getCurrentUser();
    // Limpar assinatura
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    try {
      await pushService.removeListeners();
    } catch (error) {
      console.error('Erro ao remover listeners de push:', error);
    }
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    onLogout();
  };

  const formatarData = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="home-container">
          <h1>Registro de Ponto</h1>
          <IonText>
            <p>Olá, {userEmail}</p>
          </IonText>

          <div className="buttons-container">
            <IonButton 
              expand="block" 
              color="success" 
              size="large"
              onClick={() => registrarPonto('entrada')}
            >
              Registrar Entrada
            </IonButton>

            <IonButton 
              expand="block" 
              color="danger" 
              size="large"
              onClick={() => registrarPonto('saida')}
            >
              Registrar Saída
            </IonButton>
          </div>

          <IonButton 
            expand="block" 
            fill="outline" 
            onClick={handleLogout}
          >
            Sair
          </IonButton>

          <h2>Últimos Registros</h2>

          {pontos.length === 0 ? (
            <IonText>
              <p>Nenhum registro ainda.</p>
            </IonText>
          ) : (
            <IonList>
              {pontos.map((ponto) => (
                <IonCard key={ponto.id}>
                  <IonCardHeader>
                    <IonCardTitle>
                      {ponto.tipo === 'entrada' ? '📥 Entrada' : '📤 Saída'}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p><strong>Data:</strong> {formatarData(ponto.timestamp)}</p>
                    <p><strong>Latitude:</strong> {ponto.latitude}</p>
                    <p><strong>Longitude:</strong> {ponto.longitude}</p>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          )}

          <IonLoading isOpen={loading} message="Registrando ponto..." />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
