const Discord = require('discord.js');
const ayarlar = require("../ayarlar.json");

exports.run = (client, message, args) => {
if(!message.member.hasPermission('MANAGE_CHANNELS')) return message.react(ayarlar.carpi)

let channel =  message.channel;


let everyone = message.guild.roles.cache.find(a => a.name === '@everyone');
channel.updateOverwrite(everyone, { 'SEND_MESSAGES': null }, 'Kilidi Açan '+message.author.tag);
channel.send(new Discord.MessageEmbed()
.setColor('GREEN')
.setTitle("Kanal Kilidi Açıldı!.")).then(qwe => qwe.delete({ timeout: 5000 }))

};
exports.conf = {
    aliases: ['kilit-aç'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'kilit-aç',
    açıklama:"",
    komut: "[kilit-aç]",
    help: "kilit-aç ",
    cooldown: 0

  };