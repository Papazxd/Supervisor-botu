const { MessageEmbed } = require('discord.js');
const ayarlar = require("../ayarlar.json");

exports.run = async(client, message, args) => {
  
if(![(roller.transport)].some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(new MessageEmbed().setDescription(`${message.author} Komutu kullanmak için yetkin bulunmamakta.`).setColor('RANDOM').setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setTimestamp()).then(x => x.delete({timeout: 5000}));
  
if(!args[0]) return message.channel.send(new MessageEmbed().setDescription(`${message.author} bir @RK/İD belirtmelisin.`).setColor('RANDOM').setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setTimestamp()).then(x => x.delete({timeout: 5000}));

const kanal = message.member.voiceChannel
const member = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
if (!member.voice.channel) return message.channel.send(new MessageEmbed().setDescription(`${message.author}, Belirttiğin kullanıcı seste değil.`).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('RANDOM').setTimestamp()).then(x => x.delete({timeout: 5000}));

if(!member) return;
if(message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(new MessageEmbed().setDescription(`${message.author}, Etiketlenen kullanıcı sizden üst/aynı pozisyondadır.`).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('RANDOM').setTimestamp()).then(x => x.delete({timeout: 5000}));
message.guild.member(member.id).voice.setChannel(null)
 
   message.channel.send(new MessageEmbed().setDescription(`${member} Kullancısının ${message.author} Tarafından Bağlantısı Kesildi.`).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('RANDOM').setTimestamp()).then(x => x.delete({timeout: 5000}));
   message.react((ayarlar.onay))
}
exports.conf = {
    aliases: ['kes'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'kes',
    açıklama:"",
    komut: "[kes]",
    help: "kes ",
    cooldown: 0

  };