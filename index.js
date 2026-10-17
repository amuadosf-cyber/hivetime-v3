import 'dotenv/config';
import fs from 'node:fs';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
if (!token || !clientId) throw new Error('Define DISCORD_TOKEN e CLIENT_ID nas variáveis de ambiente.');
const file = 'tracker-data.json';
let data = {};
try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
function save() { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
const cmd = new SlashCommandBuilder().setName('track').setDescription('Configurar o tracker do Hive')
 .addSubcommand(s => s.setName('add').setDescription('Adicionar jogador').addStringOption(o => o.setName('player').setDescription('Gamertag').setRequired(true)))
 .addSubcommand(s => s.setName('remove').setDescription('Remover jogador').addStringOption(o => o.setName('player').setDescription('Gamertag').setRequired(true)))
 .addSubcommand(s => s.setName('list').setDescription('Listar jogadores'))
 .addSubcommand(s => s.setName('channel').setDescription('Definir canal de notificações').addChannelOption(o => o.setName('channel').setDescription('Canal de texto').setRequired(true)));
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once('ready', async () => {
 await new REST({ version: '10' }).setToken(token).put(Routes.applicationCommands(clientId), { body: [cmd.toJSON()] });
 console.log('HiveTime V3 online:', client.user.tag);
});
client.on('interactionCreate', async i => {
 if (!i.isChatInputCommand() || i.commandName !== 'track' || !i.guildId) return;
 const cfg = data[i.guildId] ??= { players: [], channelId: null };
 const sub = i.options.getSubcommand();
 if (sub === 'list') return i.reply({ content: cfg.players.length ? cfg.players.join(', ') : 'Ainda não há jogadores monitorizados.', ephemeral: true });
 if (!i.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) return i.reply({ content: 'Precisas da permissão Gerir Servidor.', ephemeral: true });
 if (sub === 'channel') {
  const channel = i.options.getChannel('channel');
  if (!channel?.isTextBased() || typeof channel.send !== 'function') return i.reply({ content: 'Escolhe um canal de texto.', ephemeral: true });
  cfg.channelId = channel.id; save();
  return i.reply({ content: `Canal configurado: ${channel}`, ephemeral: true });
 }
 const player = i.options.getString('player').trim();
 if (!/^[a-zA-Z0-9_]{3,16}$/.test(player)) return i.reply({ content: 'Nome de jogador inválido.', ephemeral: true });
 if (sub === 'add' && !cfg.players.some(p => p.toLowerCase() === player.toLowerCase())) cfg.players.push(player);
 if (sub === 'remove') cfg.players = cfg.players.filter(p => p.toLowerCase() !== player.toLowerCase());
 save();
 return i.reply({ content: sub === 'add' ? `Adicionado: ${player}` : `Removido: ${player}`, ephemeral: true });
});
client.login(token);
