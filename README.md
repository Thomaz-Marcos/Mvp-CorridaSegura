# Rota Segura

App mobile para corredores que ajuda a escolher rotas mais seguras na cidade. Cada rota recebe uma nota (score) com base em indicadores como segurança, trânsito, limpeza e conservação, e a comunidade pode publicar alertas sobre o que encontra pelo caminho.

> **Status:** MVP / protótipo navegável. As telas reproduzem o design do Figma e permitem navegar entre elas, mas ainda não há lógica real (mapa, GPS, login ou backend). Os dados exibidos são fictícios.

## Telas

| Tela | O que mostra |
|---|---|
| **Onboarding** | Apresentação do app, criação de conta e login |
| **Mapa** | Mapa da região com alertas próximos e rotas sugeridas |
| **Planejar** | Busca de destino e rotas favoritas com score |
| **Rota** | Rota recomendada, avaliação por indicador e trechos |
| **Corrida ativa** | Gravação da corrida com tempo, progresso e botão de emergência |
| **Feed** | Alertas da comunidade e publicação de novos alertas |
| **Perfil** | Estatísticas da semana, sequência de dias e média das rotas |

## Tecnologias

- [Expo](https://expo.dev) SDK 57 + React Native 0.86
- TypeScript
- `react-native-svg` para ícones e mapa
- `expo-linear-gradient`
- Fontes Outfit e JetBrains Mono (`@expo-google-fonts`)

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) (LTS) e o app **Expo Go** no celular, ou um emulador Android/iOS.

```bash
# instalar dependências
npm install

# iniciar o servidor de desenvolvimento
npx expo start
```

Depois, escaneie o QR code com o Expo Go (Android) ou com a câmera (iOS). Também é possível abrir direto:

```bash
npm run android   # emulador Android
npm run ios       # simulador iOS (somente macOS)
npm run web       # navegador
```

## Estrutura do projeto

```
├── App.tsx              # navegação entre as telas (abas, onboarding e corrida ativa)
├── index.ts             # ponto de entrada
├── app.json             # configuração do Expo
├── assets/              # ícones e splash
└── src/
    ├── theme.ts         # cores e fontes (tokens do Figma)
    ├── components/      # componentes reutilizáveis (Texto, Chip, Barra, Ícones)
    └── screens/         # uma tela por arquivo
```

## Próximos passos

- [ ] Mapa real com localização do usuário
- [ ] Cálculo do score das rotas a partir de dados reais
- [ ] Autenticação de usuários
- [ ] Backend para alertas da comunidade
- [ ] Gravação de corrida com GPS

## Equipe

- [Thomaz Marcos](https://github.com/Thomaz-Marcos)
- [Bruna Otas](https://github.com/brunaOtas)
