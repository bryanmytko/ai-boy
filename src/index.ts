import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import path from "path";
import fs from "fs";
import { Command } from "./types";

require("dotenv").config();
const { DISCORD_BOT_TOKEN } = process.env;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
client.commands = new Collection<string, Command>();

const commandsPath = path.join(__dirname, "commands");
let commandFiles;

if (process.env.NODE_ENV === "production") {
  commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: any) => file.endsWith(".js"));
} else {
  commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: any) => file.endsWith(".ts"));
}

client.on("unhandledRejection", (e: any) => {
  console.log("Unhandled promise rejection:", e);
});

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log("Error", filePath);
  }
}

client.once(Events.ClientReady, () => {
  console.log("AI Boy is ready!");
});

client.login(DISCORD_BOT_TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  const { channel: textChannel, guildId } = interaction;

  if (!guildId || !textChannel || !interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  const query = interaction.options.getString("search");

  try {
    await command.execute(interaction, query);
  } catch (error) {
    await interaction.reply({
      content: "Uh oh...",
      ephemeral: true,
    });
  }
});
