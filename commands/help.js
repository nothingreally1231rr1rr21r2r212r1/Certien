const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const embedColor = process.env.embedColor;

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    let embed = new Discord.MessageEmbed();
    embed.setColor(embedColor);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle("الاوامر");
    embed.setFooter(':)');

    let description = `يوجد هناك ${client.commandList.length} أوامر\n\n`;

    for(var i = 0; i < client.commandList.length; i++) {
        let concatedString = "";

        try {
            concatedString = await client.commandList[i].file.help();
        } catch {
            concatedString = "**خطأ** - حدث خطأ\n";
        }

        description += concatedString;
    }

    embed.setDescription(description);
    return message.channel.send(embed);
}

exports.help = async() => {
    let name = `**help**`;
    let description = "قائمة الاوامر";
    return `${name} - ${description}\n`;
}