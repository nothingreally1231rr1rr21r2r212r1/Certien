const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const banCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(banCoolDowns.has(message.author.id)) {
        return message.channel.send(client.embedMaker(message.author, "تنبيه", `يرجى المحاولة بعد ${Number(process.env.cooldown)} ثواني`));
    }

    let req = client.request;
    if(req !== "No request") {
        return message.channel.send(client.embedMaker(message.author, "قيد الاستعمال", `هناك شخص ما يستعمل الاوامر حاليا يرجى الانتظار`));
    }

    let isAllowed = false;
    for(let i = 0; i < allowedRanks.length; i++) {
        if(message.member.roles.cache.some(role => [allowedRanks[i]].includes(role.name))) {
            isAllowed = true;
        }
    }

    if(isAllowed == false) {
        return message.channel.send(client.embedMaker(message.author, "لا توجد صلاحيات", "لا توجد لك صلاحيات لتفعيل هذا الامر"));
    }

    let username = args[0];
    if(!username) {
        return message.channel.send(client.embedMaker(message.author, "يرجى اعطاء الاسم بشكل صحيح", "انت لم تعطنا الاسم الصحيح يرجى المحاولة مرة اخرى"));
    }

    let reason = args.splice(1).join(" ");
    if(!reason) {
        return message.channel.send(client.embedMaker(message.author, "يرجى كتابة السبب", "انت لم تعطنا سببا للباند يرجى كتابة سبب الباند"));
    }

    let newRequest = {
        author: message.author.tag,
        usernameToBan: username,
        reason: reason,

        type: "Ban",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "تم ارسال الطلب", `تم ارسال الطلب بنجاح`));
    banCoolDowns.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        banCoolDowns.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = `**ban <username> <reason>**`;
    let description = "تبنيد اللاعب من اللعبة مع السبب";
    return `${name} - ${description}\n`;
}