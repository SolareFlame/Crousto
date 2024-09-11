const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder} = require('discord.js');
const { clientID, token } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const {loadServers} = require("./servers");


const deployCommands = [
    new SlashCommandBuilder()
        .setName('menu')
        .setDescription("Force l'affichage du menu du jour.")
        .toJSON(),

    new SlashCommandBuilder()
        .setName('setup')
        .setDescription("Initialise le channel pour l'affichage automatique du menu.")
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Canal à utiliser')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rôle à mentionner (défaut: @everyone)')
                .setRequired(false)
        )
        .toJSON(),

    new SlashCommandBuilder()
        .setName('update')
        .setDescription("Force la mise à jour du menu.")
        .toJSON()
];
const rest = new REST({ version: '10' }).setToken(token);

async function deploy(cID, gID) {
    try {
        console.log('Started refreshing application (/) deployCommands.');

        await rest.put(Routes.applicationGuildCommands(cID, gID), {
            body: deployCommands,
        });

        console.log('Successfully reloaded application (/) deployCommands.');
    } catch (error) {
        console.error(error);
    }
}

let list = loadServers()
list.forEach(server => {
    deploy(clientID, server.guildID);
});





