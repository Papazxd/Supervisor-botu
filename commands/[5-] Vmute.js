const { MessageEmbed } = require("discord.js")
const ayarlar = require("../ayarlar.json");
const db = require("quick.db")
const kdb = new db.table("kullanıcı")
const moment = require("moment")
const ms = require("ms")

exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.has(ayarlar.vmuteyetkili) && !message.member.hasPermission("ADMINISTRATOR")) return message.react(ayarlar.carpi)
    let embed = new MessageEmbed().setColor('RANDOM')

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let user = message.guild.member(member)
    let reason = args.splice(2).join(" ") || "Belirtilmedi."
    if (!user) return message.channel.send(embed.setDescription(`${message.author} kime ceza vereceğini yazmadın! \`.vmute Kişi/ID <sebep> <süre>\``).setTimestamp().setFooter(ayarlar.footer)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    if (!user.voice.channel) return message.react(ayarlar.carpi)
    if (!args[1]) return message.channel.send(embed.setDescription(`${message.author} ceza süresini yazmadın! \`.vmute Kişi/ID <sebep> <süre\``).setTimestamp().setFooter(ayarlar.footer)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    let sure = args[1]
        .replace("s", " Saniye")
        .replace("m", " Dakika")
        .replace("h", " Saat")
        .replace("d", " Gün")

    if (user.id === client.user.id) return message.react(ayarlar.carpi)
    if (user.id === message.author.id) return message.react(ayarlar.carpi)
    if (user.roles.highest.position >= message.member.roles.highest.position) return message.react(ayarlar.carpi)

    let atilanAy = moment(Date.now()).format("MM");
    let atilanSaat = moment(Date.now()).format("HH:mm:ss");
    let atilanGün = moment(Date.now()).format("DD");
    let bitişAy = moment(Date.now() + ms(args[1])).format("MM");
    let bitişSaat = moment(Date.now() + ms(args[1])).format("HH:mm:ss");
    let bitişGün = moment(Date.now() + ms(args[1])).format("DD");
    let muteAtılma = `${atilanGün} ${atilanAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${atilanSaat}`;
    let muteBitiş = `${bitişGün} ${bitişAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${bitişSaat}`;
    let cezaID = db.get(`cezaid.${message.guild.id}`) + 1
    let puan = await kdb.fetch(`cezapuan.${user.id}`) || "0"

    user.voice.setMute(true)
 user.roles.add(ayarlar.Vmuteli)
    message.react(ayarlar.onay)
    message.channel.send(embed.setDescription(`${user} kullanıcısı ${message.author} tarafından \`${reason}\` sebebiyle \`${sure}\` süresince voice-mute cezası aldı.`).setTimestamp().setImage(`https://img.wattpad.com/1a20dd335cc64bb98a7125e9ec5952cb0e91f01f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f525a613950676a646857475166413d3d2d3837323632313433392e313630613462333738653166623363303339333634363431363530392e676966`).setFooter(ayarlar.footer)).then(x => x.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))

    db.add(`cezaid.${message.guild.id}`, +1)
    db.add(`ceza.${message.author.id}.vmute`, 1)
    kdb.add(`cezapuan.${user.id}`, 5)
    kdb.push(`sicil.${user.id}`, { userID: user.id, adminID: message.author.id, Tip: "Voice-Mute", start: muteAtılma, cezaID: cezaID })
    kdb.set(`durum.${user.id}.vmute`, true)
    client.channels.cache.get(ayarlar.vmutelog).send(embed.setDescription(`
    
    \`•\` Ceza ID: \`#${cezaID}\`
    \`•\` Mutelenen Kullanıcı: ${user} (\`${user.id}\`)
    \`•\` Muteleyen Yetkili: ${message.author} (\`${message.author.id}\`)
    \`•\` Mute Süresi: \`${sure}\`
    \`•\` Mute Sebebi: \`${reason}\`
    \`•\` Mute Tarihi: \`${muteAtılma}\`
 `).setTimestamp().setFooter(ayarlar.footer))

    setTimeout(async() => { await kdb.delete(`durum.${user.id}.vmute`)
        if (user.voice.channel) user.voice.setMute(false)
		user.roles.remove(roller.Vmuteli)
        let log = message.guild.channels.cache.get(ayarlar.vmutelog)
        if (log) log.send(embed.setDescription(`${user} kullanıcısının **voice-mute** ceza süresi bittiği için mutesini açtım.`).setTimestamp().setFooter(ayar.footer))}, ms(args[1]))}

        exports.conf = {
            aliases: ['sesmute'],
            permLevel: 0
          };
          
          exports.help = {
            name: 'vmute',
            açıklama:"",
            komut: "[vmute]",
            help: "vmute ",
            cooldown: 0
        
          };