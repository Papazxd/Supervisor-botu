const { MessageEmbed } = require("discord.js");
const db = require("quick.db")
const kdb = new db.table("kullanıcı");
const ayarlar = require("../ayarlar.json");

exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.has(ayarlar.muteyetki) && !message.member.hasPermission("ADMINISTRATOR")) return message.react(ayarlar.carpi)
    let embed = new MessageEmbed().setColor('RANDOM')

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let user = message.guild.member(member)
    if (!user) return message.channel.send(embed.setDescription(`${message.author} kimin mutesini kaldıracağını yazmadın! \`.unvmute SEBEB/ID\``).setTimestamp().setFooter(ayarlar.footer)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    if (!user.voice.channel) return message.react(ayarlar.carpi)
    if (user.id === message.author.id) return message.react(ayarlar.carpi)
    if (user.id === client.user.id) return message.react(ayarlar.carpi)
    if (user.hasPermission(8)) return message.react(ayarlar.carpi)


    let data = await kdb.get(`durum.${user.id}.vmute`)
    if (!data) return message.channel.send(embed.setDescription(`Kullanıcı zaten muteli değil.`).setFooter(ayarlar.footer)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))

    if (data) {
        await kdb.delete(`durum.${user.id}.vmute`)
        user.voice.setMute(false).catch()
        message.react(ayarlar.onay)
		user.roles.remove(ayarlar.Vmuteli)
        client.channels.cache.get(ayarlar.mutelog).send(embed.setDescription(`${user} kullanıcısının \`voice-mute\` cezası ${message.author} tarafından kaldırıldı.`).setTimestamp().setImage(`https://img.wattpad.com/1a20dd335cc64bb98a7125e9ec5952cb0e91f01f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f525a613950676a646857475166413d3d2d3837323632313433392e313630613462333738653166623363303339333634363431363530392e676966`).setFooter(ayarlar.footer))}}

        exports.conf = {
            aliases: ['unvmute'],
            permLevel: 0
          };
          
          exports.help = {
            name: 'unvmute',
            açıklama:"",
            komut: "[unvmute]",
            help: "unvmute ",
            cooldown: 0
        
          };