const { MessageEmbed } = require("discord.js");
const ayarlar = require("../ayarlar.json");

  
exports.run = async(client, message, args) => {
	
	  if (
    !message.member.roles.cache.has(ayarlar.RegisterYetki) &&
    !message.member.hasPermission("ADMINISTRATOR")
  )
    
    return message.channel.send(
      new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setDescription(`Komutu kullanmaya \`erişimin\` yok`)
      .setColor("RED")
      );
  
  
    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp().setFooter(ayarlar.footer)
    let rol = ayarlar.taglırol
    let tag = ayarlar.tag
    message.guild.members.cache.filter(s => s.user.username.includes(tag) && !s.roles.cache.has(rol)).forEach(m => m.roles.add(rol))
    message.channel.send(embed.setDescription(`
  \`${tag}\`  İsminde tagını taşıyanlara rol veriliyor
`))
}
exports.conf = {
    aliases: ['tag-rol'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'tag-rol',
    açıklama:"",
    komut: "[tag-rol]",
    help: "tag-rol ",
    cooldown: 0

  };