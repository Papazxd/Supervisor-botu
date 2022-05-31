const Discord = require('discord.js')
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
        let embed = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setTimestamp().setThumbnail(message.author.avatarURL)
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(embed.setDescription("Bu Komut İçin Yetkin Bulunmuyor.")).then(x => x.delete({ timeout: 3000 }))
        }
        let sesteolmayan = message.guild.members.cache.filter(s => s.roles.cache.has(ayarlar.RegisterYetki)).filter(s => !s.voice.channel).map(s => s).join('\n')
        message.channel.send(`${sesteolmayan} \n \`\`\`Merhabalar sunucumuzun ses aktifliğini arttırmak için lütfen müsait isen public odalara değil isen alone odalarına geçer misin?\`\`\``)
    
}
exports.conf = {
    aliases: ['ytsay'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'ytsay',
    açıklama:"ytsay",
    komut: "[ytsay]",
    help: "ytsay ",
    cooldown: 0

  };