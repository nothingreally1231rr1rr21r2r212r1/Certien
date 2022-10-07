const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const unMuteCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(unMuteCoolDowns.has(message.author.id)) {
        return message.channel.send(client.embedMaker(message.author, "يرجى الانتظار", `قيد الانتظار ${Number(process.env.cooldown)} ثواني`));
    }

    let req = client.request;
    if(req !== "No request") {
        return message.channel.send(client.embedMaker(message.author, "قيد الاستعمال", `هناك شخص ما يستعمل الامر يرجى الانتظار`));
    }

    let isAllowed = false;
    for(let i = 0; i < allowedRanks.length; i++) {
        if(message.member.roles.cache.some(role => [allowedRanks[i]].includes(role.name))) {
            isAllowed = true;
        }
    }

    if(isAllowed == false) {
        return message.channel.send(client.embedMaker(message.author, "لا توجد صلاحيات", "ليس لديك صلاحيات لتفعيل الامر"));
    }

    let username = args[0];
    if(!username) {
        return message.channel.send(client.embedMaker(message.author, "لا يوجد اسم", "يرجى تزويدنا بالاسم"));
    }

    let newRequest = {
        usernameToUnMute: username,

        type: "Unmute",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "تم ارسال الطلب", `تم ارسال الطلب بنجاح اذا كان لا يوجد رد `));
    unMuteCoolDowns.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        unMuteCoolDowns.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = `**unmute <username>**`;
    let description = "فك ميوت اللاعب من اللعبة";
    return `${name} - ${description}\n`;
}