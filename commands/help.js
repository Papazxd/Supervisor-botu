const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const ayarlar = require("../ayarlar.json");
exports.run = (client, message, args) => {
  
if(![(ayarlar.registeryetki)].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.react(ayarlar.carpi)

const papaz = new Discord.MessageEmbed()
.setThumbnail(message.author.avatarURL({dynamic: true}))
.setDescription(` **Komutlar**

\`.ban @etiket/ID sebeb\`
\`.jail @etiket/ID 1m sebeb\`
\`.mute @etiket/ID 1m sebeb\`
\`.vmute  @etiket/ID 1m sebeb\`
\`.unban <id>\`
\`.unjail Ceza Kaldırısın\`
\`.unmute Muteyi Kaldırısınız\`
\`.unvmute ses mute kaldırma\`
\`.sicil kişi\`
\`.sicil-sil kişi\`
\`.afk sebeb\`
\`.git kişi\`
\`.gel kişi\`
\`.kes kişi\`
\`.kişi-bilgi\`
\`.kilit\`
\`.sil\`
\`.snipe\`
\`.kilit-aç\`
\`.vip kişi\`
\`.zengin isim\`
\`.ytsay\`
\`.tag-tara tag rol veriri\`

`)
message.channel.send(papaz)



}
exports.conf = {
    aliases:[]
};

exports.help = {
    name:'help'
}