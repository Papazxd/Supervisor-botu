const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  let embed = new Discord.MessageEmbed()
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`Geçerli bir üye belirtmelisiniz.`)).then(qwe => qwe.delete({ timeout: 5000 }));

if (member.user.presence.status == "offline") return message.channel.send(embed.setDescription(`${member} kullanıcısı offline olduğu için cihazına bakılamıyor.`))
let cihaz = ""
let ha = Object.keys(member.user.presence.clientStatus)
if (ha[0] == "mobile") cihaz = "Mobil Telefon"
if (ha[0] == "desktop") cihaz = "Masaüstü Uygulama"
if (ha[0] == "web") cihaz = "İnternet Tarayıcısı"


message.channel.send(embed.setDescription(`
 ${member} kullanıcısı \`${cihaz}\` cihazından bağlanıyor.
`))
};

exports.conf = {
    aliases: ['cihaz'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'cihaz',
    açıklama:"cihaz",
    komut: "[cihaz]",
    help: "cihaz ",
    cooldown: 0

  };