import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonLoading
} from '@ionic/react';
import { authService } from '../services/authService';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      await authService.login(email, senha);
      onLogin();
    } catch (error: any) {
      setErro('Erro ao fazer login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async () => {
    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      await authService.cadastrar(email, senha);
      onLogin();
    } catch (error: any) {
      setErro('Erro ao criar conta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="login-container">
          <h1>Registro de Ponto</h1>

          <IonItem>
            <IonLabel position="floating">E-mail</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e: any) => setEmail(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Senha</IonLabel>
            <IonInput
              type="password"
              value={senha}
              onIonChange={(e: any) => setSenha(e.detail.value!)}
            />
          </IonItem>

          {erro && (
            <IonText color="danger">
              <p>{erro}</p>
            </IonText>
          )}

          <IonButton expand="block" onClick={handleLogin}>
            Entrar
          </IonButton>

          <IonButton expand="block" fill="outline" onClick={handleCadastro}>
            Criar conta
          </IonButton>

          <IonLoading isOpen={loading} message="Aguarde..." />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
