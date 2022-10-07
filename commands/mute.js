const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const muteCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(muteCoolDowns.has(message.author.id)) {
        return message.channel.send(client.embedMaker(message.author, "يرجى الانتظار", `يرجى المحاولة بعد ${Number(process.env.cooldown)} ثواني`));
    }

    let req = client.request;
    if(req !== "No request") {
        return message.channel.send(client.embedMaker(message.author, "قيد الاستعمال", `هناك شخص ما استعمل الامر من قبل يرجى الانتظار`));
    }

    let isAllowed = false;
    for(let i = 0; i < allowedRanks.length; i++) {
        if(message.member.roles.cache.some(role => [allowedRanks[i]].includes(role.name))) {
            isAllowed = true;
        }
    }

    if(isAllowed == false) {
        return message.channel.send(client.embedMaker(message.author, "لا توجد صلاحيات", "ليس لديك الصلاحيات لتشغيل الامر"));
    }

    let username = args[0];
    if(!username) {
        return message.channel.send(client.embedMaker(message.author, "لا يوجد اسم", "يرجى اعطاء الاسم المراد كتمه"));
    }

    let newRequest = {
        usernameToMute: username,

        type: "Mute",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "تم ارسال الطلب", "لقد تم ارسال الطلب "));
    muteCoolDowns.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        muteCoolDowns.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = `**mute <username>**`;
    let description = "ميوت اللاعب من اللعبة";
    return `${name} - ${description}\n`;
}