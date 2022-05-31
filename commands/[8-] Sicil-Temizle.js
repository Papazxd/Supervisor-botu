const { MessageEmbed } = require("discord.js")
const ayarlar = require("../ayarlar.json");
const db = require("quick.db")
const kdb = new db.table("kullanıcı")

exports.run = async(client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.react(ayarlar.carpi)
    let embed = new MessageEmbed().setColor('RANDOM')

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
    let user = message.guild.member(member)
    kdb.delete(`sicil.${user.id}`)
    kdb.delete(`cezapuan.${user.id}`)
    message.react(ayarlar.onay)}


exports.conf = {
    aliases: ['sicil-sil'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'sicil-sil',
    açıklama:"",
    komut: "[sicil-sil]",
    help: "sicil-sil ",
    cooldown: 0

  };