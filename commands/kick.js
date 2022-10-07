const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const kickCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(kickCoolDowns.has(message.author.id)) {
        return message.channel.send(client.embedMaker(message.author, "الرجاء الانتظار", `انتظر حتى after ${Number(process.env.cooldown)} ثواني`));
    }

    let req = client.request;
    if(req !== "No request") {
        return message.channel.send(client.embedMaker(message.author, "قيد الاستعمال", `الامر الحالي قيد الاستعمال`));
    }

    let isAllowed = false;
    for(let i = 0; i < allowedRanks.length; i++) {
        if(message.member.roles.cache.some(role => [allowedRanks[i]].includes(role.name))) {
            isAllowed = true;
        }
    }

    if(isAllowed == false) {
        return message.channel.send(client.embedMaker(message.author, "لا يوجد صلاحيات", "لا توجد صلاحية لتشغيل الامر"));
    }

    let username = args[0];
    if(!username) {
        return message.channel.send(client.embedMaker(message.author, "لا يوجد اسم", "الرجاء اعطاء اسم لتفعيل الامر"));
    }

    let reason = args.splice(1).join(" ");
    if(!reason) {
        return message.channel.send(client.embedMaker(message.author, "لا يوجد سبب معطى", "يرجى اعطاء سبب"));
    }

    let newRequest = {
        author: message.author.tag,
        usernameToKick: username,
        reason: reason,

        type: "Kick",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "تم ارسال الطلب", "اذا كان هناك طلب يرجى الانتظار"));
    kickCoolDowns.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        kickCoolDowns.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = `**kick <username> <reason>**`;
    let description = "طرد اللاعب من اللعبة مع السبب";
    return `${name} - ${description}\n`;
}