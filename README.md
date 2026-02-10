# TicTacToe Frontend

Este projeto é o **frontend web** do sistema **TicTacToe**, desenvolvido em **React com Next.js**, responsável pela interface do usuário para partidas online de **Jogo da Velha**, comunicação em tempo real e visualização de estatísticas.

O frontend consome a **API TicTacToe** e utiliza **SignalR** para atualizações em tempo real, oferecendo uma experiência interativa, nostálgica e intuitiva.

O projeto foi desenvolvido como **teste técnico**, com foco em **UI/UX**, **componentização**, **boas práticas**, **organização de código** e **integração eficiente com o backend**.

---

## Tecnologias utilizadas

- Next.js (React)
- TypeScript
- SignalR Client
- CSS Modules / CSS puro
- Fetch API
- Docker (opcional)

---

## Visão geral da aplicação

- Tela inicial com entrada de nickname
- Matchmaking automático
- Partidas em tempo real
- Destaque visual do jogador atual
- Animações para vitória, derrota e empate
- Tela de ranking
- Tela de histórico de partidas
- Tela de gráficos de vitórias por jogador
- Tela de análise de estratégias vencedoras
- Registro e visualização de logs de ações
- Visual nostálgico inspirado em caderno escolar

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git
- Backend TicTacToe em execução

---

## Configuração

Clone o repositório:

```
git clone https://github.com/taillonmiguel/TicTacToe.Web.git
cd tictactoe.frontend
```

Configure a URL do backend no arquivo de ambiente:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SIGNALR_URL=http://localhost:8080/hubs/tictactoe
```

---

## Executando o projeto

Instale as dependências:

```
npm install
```

Execute a aplicação em modo desenvolvimento:

```
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

ou IPv4

```
http://192.168.1.14:3000
```

## Configuração da URL do Backend (API + SignalR)

O frontend pode apontar para `localhost` (mesma máquina) ou para o **IPv4 da sua máquina** (para jogar em 2 dispositivos na mesma rede).

### Como obter o IPv4 no Windows

1. Abra o **Prompt de Comando (CMD)** ou **PowerShell**
2. Execute:

```
ipconfig
```

3. Procure pelo adaptador que você está utilizando (normalmente Adaptador Ethernet ou Wi-Fi) e copie o valor de:

- Endereço IPv4 (exemplo: 192.168.1.14)

**Não utilize**:

- 0.0.0.0
- IPs de adaptadores virtuais como vEthernet (Default Switch) ou WSL

### Opção A — Jogando no mesmo PC (localhost)

Crie/edite o arquivo `.env.local` na raiz do projeto:

NEXT_PUBLIC_API_URL=http://localhost:8082  
NEXT_PUBLIC_HUB_URL=http://localhost:8082/hubs/tictactoe

### Opção B — Jogando em 2 dispositivos na mesma rede (IPv4)

Use o IPv4 do seu computador (ex.: `192.168.1.14`):

NEXT_PUBLIC_API_URL=http://192.168.1.14:8082  
NEXT_PUBLIC_HUB_URL=http://192.168.1.14:8082/hubs/tictactoe

Depois de alterar o `.env.local`, pare e rode o frontend novamente (`npm run dev`) para o Next.js recarregar as variáveis.

---

## Fluxo de jogo

1. Usuário informa o nickname na tela inicial
2. Frontend conecta ao SignalR
3. Chama endpoint de matchmaking
4. Aguarda evento `MatchFound`
5. Entra automaticamente na sala da partida
6. Recebe atualizações do jogo em tempo real
7. Envia jogadas via REST
8. Exibe resultado final com animações visuais

---

## Comunicação em tempo real

- Conexão via SignalR
- Eventos escutados:
  - MatchFound
  - GameUpdated
  - GameFinished
- Comunicação baseada em salas (`room:{gameId}`)

---

## Experiência visual (UI/UX)

- Interface clara com fundo branco
- Botões coloridos com estilo retrô
- Tabuleiro desenhado como linhas de caderno
- Animação de “festa” para vitória
- Estilo acinzentado para empate
- Mensagem personalizada para derrota
- Layout centralizado e responsivo

---

## Telas disponíveis

- Tela inicial
- Tela de partida
- Ranking de jogadores
- Histórico de partidas
- Gráficos de vitórias
- Estratégias vencedoras
- Logs e ações da partida

---

## Observações finais

Este frontend foi estruturado para demonstrar:

- Integração real-time com SignalR
- Organização de componentes
- Separação de responsabilidades
- Boas práticas em React / Next.js
- Atenção à experiência do usuário
- Clareza na comunicação com o backend

---

> Projeto desenvolvido exclusivamente para fins de **avaliação técnica**.
