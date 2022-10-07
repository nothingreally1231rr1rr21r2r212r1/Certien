const Discord = require('discord.js');

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
        return message.channel.send(client.embedMaker(message.author, "لا توجد صلاحية", "لا يمكنك تفعيل الامر لعدم وجود الصلاحيات"));
    }

    let username = args[0];
    if(!username) {
        return message.channel.send(client.embedMaker(message.author, "الرجاء ادخال الاسم", `اعطنا اسم من فضلك`))
    }

    let newRequest = {
        userToCheck: username,

        type: "CheckMute",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "تم ارسال الطلب", "لقد تم ارسال الطلب بنجاح"));
}

exports.help = async() => {
    let name = "**checkmute <username>**";
    let description = "التحقق ما إذا كان اللاعب لديه ميوت او لا";
    return `${name} - ${description}\n`;
}