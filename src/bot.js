const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { token } = require('../config.json');

const { sendMenu, sendHelp } = require('./commands');
const { startIntervalCheck, updateMenu } = require('./update');
const {saveServers, loadServers} = require("./servers");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('ready', () => {
    console.log(`Bot logged as ${client.user.tag}`);
    client.user.setActivity("localiser votre pitance.");
    startIntervalCheck();
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'menu') {
        if(!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply({
                content: "Vous devez être administrateur pour forcer l'envoi du menu.",
                ephemeral: true
            });
            return
        }

        let list = loadServers();
        let server = list.find(server => server.guildID === interaction.guildId);
        if(!server) {
            interaction.reply({
                content: "Ce serveur n'est pas configuré pour recevoir le menu du jour. Utilisez `/setup` pour configurer le serveur.",
                ephemeral: true
            });
            return;
        }
        await sendMenu(interaction.channelId, interaction)
    }

    if(commandName === 'setup') {
        if(!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply({
                content: "Vous devez être administrateur pour configurer le bot.",
                ephemeral: true
            });
            return
        }

        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');

        let reply = "<#" + channel + "> est maintenant configuré pour recevoir le menu du jour.";
        if(role) {
            reply += "\nLe rôle <@&" + role + "> sera mentionné.";
            saveServers(interaction.guildId, channel.id, role.id);
        } else {
            reply += "\nLe rôle @everyone sera mentionné (défaut) modifiable avec le paramètre 'role' dans le `/setup.`";
            saveServers(interaction.guildId, channel.id, "");
        }

        interaction.reply({
            content: reply,
            ephemeral: true
        });
    }

    if(commandName === 'update') {
        if(!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply({
                content: "Vous devez être administrateur pour configurer le bot.",
                ephemeral: true
            });
            return
        }

        updateMenu();
        interaction.reply({
            content: "Mise à jour forcée réalisée.",
            ephemeral: true
        });
    }

    if(commandName === 'help') {
        await sendHelp(interaction);
    }
});

module.exports = client;

client.login(token);


