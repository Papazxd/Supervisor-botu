const { MessageEmbed } = require("discord.js");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  if(!message.member.roles.cache.get(ayarlar.banyetkili) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send()
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor('RANDOM').setTimestamp();
  if (!args[0] || isNaN(args[0])) return message.channel.send(embed.setDescription("Geçerli bir kişi ID'si belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  let kisi = await client.users.fetch(args[0]);
  if(kisi) {
    let reason = args.splice(1).join(" ") || "sebep belirtilmedi";
    message.guild.members.unban(kisi.id).catch(err => message.channel.send(embed.setDescription("Belirtilen ID numarasına sahip bir ban bulunamadı!")).then(x => x.delete({timeout: 5000})));

    if(ayarlar.banlog && client.channels.cache.has(ayarlar.banlog)) client.channels.cache.get(ayarlar.banlog).send(new MessageEmbed().setColor('RANDOM').setImage(`https://data.whicdn.com/images/192611812/original.gif`).setTimestamp().setDescription(`**Kaldıran Yetkili:** ${message.author} (${message.author.id})\n**Banı Kaldırılan Üye:** ${kisi.tag} (${kisi.id})`));
  } else {
    message.channel.send(embed.setDescription("Geçerli bir kişi ID'si belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    message.channel.send(embed.setDescription("Kullanıcının Banı Açıldı Sunucuya Giriş Yapabilir.")).then(x => x.delete({timeout: 5000}));
    message.react(ayarlar.onay)
  };
};
exports.conf = {
    aliases: ['unban'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'unban',
    açıklama:"",
    komut: "[unban]",
    help: "unban ",
    cooldown: 0

  };