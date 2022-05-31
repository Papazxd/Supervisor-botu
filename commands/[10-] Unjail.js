const ms = require('ms')
const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const ayarlar = require("../ayarlar.json");
const kdb = new db.table("kullanıcı")
const moment = require("moment")

exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.has(ayarlar.jailyetkil) && !message.member.hasPermission("ADMINISTRATOR")) return message.react(ayar.carpi)
    let embed = new MessageEmbed().setColor('RANDOM')

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let user = message.guild.member(member)
    if (!user) return message.channel.send(embed.setDescription(`${message.author} kimin yasağını kaldıracağını yazmadın! \`.unjail @Kişi/ID\``).setTimestamp().setFooter(ayar.footer)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))

    if (user.id === message.author.id) return message.react(ayarlar.carpi)
    if (user.id === client.user.id) return message.react(ayarlar.carpi)
    if (user.hasPermission(8)) return message.react(ayarlar.carpi)
		
    user.roles.set([ayarlar.Unregister])
	user.setNickname("Kayıtsız") 
	message.react(ayarlar.onay)
		
    client.channels.cache.get(ayarlar.jaillog).send(embed.setDescription(`${user} kullanıcısının \`karantina\` cezası ${message.author} tarafından kaldırıldı.`).setTimestamp().setImage(`https://giffiles.alphacoders.com/215/215939.gif`).setFooter(ayarlar.footer))}
    exports.conf = {
        aliases: ['unjail'],
        permLevel: 0
      };
      
      exports.help = {
        name: 'unjail',
        açıklama:"",
        komut: "[unjail]",
        help: "unjail ",
        cooldown: 0
    
      };