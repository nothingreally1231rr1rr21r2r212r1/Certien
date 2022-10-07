const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const unbanCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(unbanCoolDowns.has(message.author.id)) {
        return message.channel.send(client.embedMaker(message.author, "يرجى الانتظار", `يرجى الانتظار ${Number(process.env.cooldown)} حتى`));
    }

    let req = client.request;
    if(req !== "No request") {
        return message.channel.send(client.embedMaker(message.author, "قيد الاستعمال", `يرجى الانتظار`));
    }

    let isAllowed = false;
    for(let i = 0; i < allowedRanks.length; i++) {
        if(message.member.roles.cache.some(role => [allowedRanks[i]].includes(role.name))) {
            isAllowed = true;
        }
    }

    if(isAllowed == false) {
        return message.channel.send(client.embedMaker(message.author, "تحذير", "لا يوجد صلاحيات"));
    }

    let username = args[0];
    if(!username) {
        return message.channel.send(client.embedMaker(message.author, "لا يوجد اسم", "لا يوجد اسم لفك الباند"));
    }

    let newRequest = {
        author: message.author.tag,
        usernameToUnBan: username,

        type: "Unban",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "تم ارسال الطلب", `تم ارسال الطلب بنجاحn`));
    unbanCoolDowns.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        unbanCoolDowns.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = `**unban <username>**`;
    let description = "فك باند اللاعب من اللعبة";
    return `${name} - ${description}\n`;
}