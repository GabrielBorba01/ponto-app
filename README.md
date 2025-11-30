# Registro de Ponto - Ionic React

Aplicativo de registro de ponto com geolocalização usando Ionic, React, Capacitor e Firebase.

## Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative os seguintes serviços:
   - **Authentication** (Email/Password)
   - **Cloud Firestore**
   - **Cloud Messaging**

4. Adicione um app Web e copie as credenciais
5. Cole as credenciais em `src/firebaseConfig.ts`

### Configurar Firestore

No Firebase Console, vá em Firestore Database e configure as regras:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pontos/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /tokens/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Configurar FCM para Android

1. No Firebase Console, vá em Configurações do Projeto > Geral
2. Role até "Seus apps" e clique em adicionar app Android
3. Package name: `com.ponto.app`
4. Baixe o arquivo `google-services.json`
5. Coloque o arquivo em `android/app/google-services.json`

## Instalação

```bash
# Instalar dependências
npm install

# Adicionar plataforma Android
npx cap add android

# Sincronizar
npx cap sync
```

## Executar

```bash
# Web
ionic serve

# Android
ionic cap run android

# Build e sync
npm run build
npx cap sync
npx cap open android
```

## Enviar Notificação de Teste

1. Acesse Firebase Console > Cloud Messaging
2. Clique em "Enviar sua primeira mensagem"
3. Digite título e texto
4. Clique em "Enviar mensagem de teste"
5. Cole o token FCM do dispositivo (aparece no console do app)
6. Clique em "Testar"

## Estrutura

- `src/firebaseConfig.ts` - Configuração do Firebase
- `src/services/authService.ts` - Serviço de autenticação
- `src/services/pontoService.ts` - Serviço de pontos (Firestore)
- `src/services/pushService.ts` - Serviço de push notifications
- `src/pages/LoginPage.tsx` - Tela de login/cadastro
- `src/pages/HomePage.tsx` - Tela principal com registro de ponto
