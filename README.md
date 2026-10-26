# Pace

App mobile para corredores que ajuda a escolher rotas mais seguras na cidade. O corredor planeja trajetos a pé com rotas reais, acompanha a corrida em primeira pessoa e compartilha alertas com a comunidade sobre o que encontra pelo caminho.

> **Status:** MVP funcional. Mapa, GPS, busca de rotas, login e feed de alertas já funcionam de verdade. As rotas já recebem uma nota de segurança calculada a partir dos alertas da comunidade (veja [Próximos passos](#próximos-passos)).

## Funcionalidades

- **Login e cadastro** com e-mail e senha (Supabase Auth); a sessão fica salva no aparelho.
- **Mapa real** com a localização do celular.
- **Planejamento de rota** com busca de endereço (autocompletar) e rotas a pé reais, com alternativas (Google Routes API).
- **Rotas favoritas** e **histórico de rotas**, salvos no aparelho.
- **Corrida ativa** em primeira pessoa, com navegação curva a curva e gravação por GPS.
- **Feed de alertas** da comunidade: publicar (com a localização atual), curtir e apagar os próprios alertas (Supabase).
- **Alertas no mapa**: os alertas dos últimos 30 dias aparecem como pontos coloridos (perigo, atenção, positivo).
- **Nota de segurança** de cada rota (0–100) e ordenação por "Mais segura": considera os alertas a até 60 m do trajeto; cada alerta perde metade do peso a cada 10 dias e pesa mais com curtidas. Veja [`src/utils/seguranca.ts`](src/utils/seguranca.ts).
- **Perfil** com estatísticas das corridas gravadas.

## Telas

| Tela | O que mostra |
| --- | --- |
| **Onboarding** | Apresentação do app, criação de conta e login |
| **Mapa** | Mapa da região com a posição atual |
| **Planejar** | Busca de destino, rotas sugeridas e favoritas |
| **Rotas** | Detalhes da rota escolhida, trechos e histórico |
| **Corrida ativa** | Navegação curva a curva, tempo, distância e progresso |
| **Feed** | Alertas da comunidade e publicação de novos alertas |
| **Perfil** | Estatísticas das corridas |

## Tecnologias

- [Expo](https://expo.dev) SDK 57 + React Native 0.86, TypeScript
- [Supabase](https://supabase.com) (`@supabase/supabase-js`): autenticação, alertas e curtidas
- Google Maps: `react-native-maps` no celular, `@vis.gl/react-google-maps` na web e WebView para o mapa da corrida
- Google Places e Routes API para busca de endereço e rotas
- `expo-location` para GPS
- `@react-native-async-storage/async-storage` para favoritas, histórico e corridas
- `react-native-svg`, `expo-linear-gradient` e fontes Outfit e JetBrains Mono (`@expo-google-fonts`)

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) (LTS), um projeto no Supabase e uma chave de API do Google Maps. Para testar no celular, use um development build (`eas build --profile development`) ou o **Expo Go**; o mapa nativo com chave própria só funciona em build.

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha (o arquivo não vai para o Git):

| Variável | Para que serve |
| --- | --- |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Mapas, busca de endereço (Places) e rotas (Routes). Ative essas APIs no Google Cloud |
| `EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID` | (Opcional) Map ID do mapa vetorial, usado para girar e inclinar o mapa. Sem ele usa `DEMO_MAP_ID` |
| `EXPO_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Chave `anon`/publishable do Supabase (nunca use a `service_role`) |

Sem as chaves do Supabase o app abre, mas o login e o feed avisam que não estão configurados.

### 3. Criar o banco no Supabase

No **SQL Editor** do projeto, cole e execute uma vez o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Ele cria as tabelas de perfis, alertas e curtidas, o gatilho que gera o perfil no cadastro e as políticas de acesso (RLS).

Se o banco já existia antes de os alertas terem localização, execute também [`supabase/migracao-alertas-localizacao.sql`](supabase/migracao-alertas-localizacao.sql). Alertas antigos ficam sem coordenadas e não entram no mapa nem na nota.

### 4. Iniciar

```bash
npx expo start
```

Depois, escaneie o QR code com o Expo Go (Android) ou com a câmera (iOS). Também é possível abrir direto:

```bash
npm run android   # emulador Android
npm run ios       # simulador iOS (somente macOS)
npm run web       # navegador
```

Outros comandos úteis:

```bash
npm run lint        # ESLint
npx tsc --noEmit    # checagem de tipos
```

## Estrutura do projeto

```text
├── App.tsx              # sessão, abas, onboarding e corrida ativa
├── index.ts             # ponto de entrada
├── app.json             # configuração do Expo
├── app.config.ts        # injeta a chave do Google Maps no plugin do react-native-maps
├── eas.json             # perfis de build do EAS (development, preview, production)
├── assets/              # ícones e splash
├── supabase/
│   └── schema.sql       # tabelas, gatilhos e políticas do banco
└── src/
    ├── theme.ts         # cores e fontes (tokens do Figma)
    ├── components/      # Texto, Chip, Barra, Botão, Ícones e mapas (nativo e web)
    ├── data/            # alertas (Supabase), favoritas, histórico e corridas (AsyncStorage)
    ├── hooks/           # posição, corrida, navegação, rotas reais, sessão e sugestões de endereço
    ├── lib/             # cliente do Supabase
    ├── screens/         # uma tela por arquivo
    └── utils/           # câmera, estatísticas e formatação
```

## Próximos passos

- [x] Mapa real com localização do usuário
- [x] Autenticação de usuários
- [x] Backend para alertas da comunidade
- [x] Gravação de corrida com GPS
- [x] Alertas da comunidade exibidos no mapa e considerados na escolha da rota
- [x] Nota de segurança das rotas a partir dos alertas
- [ ] Notas de trânsito, limpeza e conservação a partir de dados reais
- [ ] Botão de emergência durante a corrida

## Equipe
git shortlog -sn

- [Thomaz Marcos](https://github.com/Thomaz-Marcos)
- [Bruna Otas](https://github.com/brunaOtas)
- [Santangelo Uchoa](https://github.com/SantangeloUchoa)
- [Marcos](https://github.com/MarcosV26)
