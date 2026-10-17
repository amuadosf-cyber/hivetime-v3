# HiveTime V3

Bot Discord para gerir listas de jogadores do Minecraft The Hive por servidor.

## Funcionalidades já implementadas
- `/track add player:<nome>` — adicionar jogador
- `/track remove player:<nome>` — remover jogador
- `/track list` — ver jogadores monitorizados
- `/track channel channel:<canal>` — definir canal de notificações
- Configurações independentes por servidor, guardadas em `tracker-data.json`.

**Importante:** esta é a primeira versão funcional de configuração. **Ainda não monitoriza automaticamente entradas, saídas, login streaks ou partidas.** Essas funcionalidades exigem uma fonte de dados fiável que disponibilize os eventos ou estados do The Hive. Não é possível garantir a deteção em tempo real só com estatísticas públicas.

## Configuração
1. Cria um bot no Discord Developer Portal e convida-o com os scopes `bot` e `applications.commands` e permissões para ver e enviar mensagens no canal escolhido.
2. Define as variáveis de ambiente `DISCORD_TOKEN` e `CLIENT_ID` no Railway. Nunca publiques o token nem o coloques no GitHub.
3. Instala as dependências com `npm install` e inicia com `npm start`.
4. No Discord, usa `/track channel` e `/track add`.

## Nota sobre armazenamento
O ficheiro JSON local pode desaparecer num redeploy do Railway sem um volume persistente. Para produção, configura um volume persistente ou uma base de dados.
