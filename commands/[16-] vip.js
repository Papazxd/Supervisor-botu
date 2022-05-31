const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require('quick.db');



exports.run = async (client, message, args) => {
    if(!message.member.roles.cache.get(ayarlar.registeryetkili) && !message.member.hasPermission('ADMINISTRATOR')) return message.react(ayarlar.carpi)

    const etiketlenenKişi = message.mentions.members.first() || message.guild.members.cache.get(args[0])

    const papaz = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
    .setTimestamp()
    
    if(etiketlenenKişi.roles.cache.has(ayarlar.viprol)) return message.channel.send(papaz.setDescription(`Kullanıcıdan başarıyla vip <@&${ayarlar.viprol}> rolü alındı!`)).then(etiketlenenKişi.roles.remove(ayarlar.viprol)).then(m => m.delete({ timeout: 9000 }) && message.delete({ timeout: 9000 }))
    
    etiketlenenKişi.roles.add(ayarlar.viprol)
    
    message.react(ayarlar.onay)
    
    message.channel.send(papaz.setDescription(`Kullanıcıya başarıyla <@&${ayarlar.viprol}> rolü verildi!`)).then(m => m.delete({ timeout: 9000 }) && message.delete({ timeout: 9000 }))
    

}
exports.conf = {
    aliases: ['vip'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'vip',
    açıklama:"",
    komut: "[vip]",
    help: "vip ",
    cooldown: 0

  };