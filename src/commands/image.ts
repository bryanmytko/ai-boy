import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string
) => {
  const { id } = interaction;
  interaction.deferReply();

  console.log("interaction id: ", id);
  interaction.followUp(`Oh you wanna see a picture of a ${query}?`);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Text-to-image generation.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Tell me what you want to see!")
        .setRequired(true)
    ),
  execute,
};
