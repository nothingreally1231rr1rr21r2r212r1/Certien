const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const setlevelcooldown = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(setlevelcooldown.has(message.author.id)) {
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

      let reason = args.splice(1).join(" ");
    if(!reason) {
        return message.channel.send(client.embedMaker(message.author, "يرجى كتابة السبب", "يرجى كتابة رقم اللفل"));
    }


    let newRequest = {
        usernametosetlevel: username,
        reason: reason,

        type: "setlevel",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "تم ارسال الطلب", `تم ارسال الطلب بنجاح اذا كان لا يوجد رد `));
    setlevelcooldown.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        setlevelcooldown.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = `**setlevel <username> <number>**`;
    let description = " تحديد لفل من اللعبة";
    return `${name} - ${description}\n`;
}