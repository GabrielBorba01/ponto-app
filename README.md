# Registro de Ponto - Ionic React

Aplicativo de registro de ponto com geolocalização usando Ionic, React, Capacitor e Firebase.

```bash
# Instalar dependências
npm install
```

## Estrutura

- `src/firebaseConfig.ts` - Configuração do Firebase
- `src/services/authService.ts` - Serviço de autenticação
- `src/services/pontoService.ts` - Serviço de pontos (Firestore)
- `src/services/pushService.ts` - Serviço de push notifications
- `src/pages/LoginPage.tsx` - Tela de login/cadastro
- `src/pages/HomePage.tsx` - Tela principal com registro de ponto
