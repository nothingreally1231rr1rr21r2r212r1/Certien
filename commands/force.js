const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    let isAllowed = false;
    for(let i = 0; i < allowedRanks.length; i++) {
        if(message.member.roles.cache.some(role => [allowedRanks[i]].includes(role.name))) {
            isAllowed = true;
        }
    }

    if(isAllowed == false) {
        return message.channel.send(client.embedMaker(message.author, "لا صلاحيات", "لا توجد لديك صلاحية"));
    }

    client.request = "No request";
    return message.channel.send(client.embedMaker(message.author, "تم", `I الطلب سيغلق`));
}

exports.help = async() => {
    let name = "**force**";
    let description = "اجبار الأمر للالغاء (مفيد عندما الاوامر يحدث لها تعليق)";
    return `${name} - ${description}\n`;
}