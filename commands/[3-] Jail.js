const { MessageEmbed } = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db")
const kdb = new db.table("kullanıcı");
const moment = require("moment");
exports.run = async(client, message, args) => {

if(!message.member.roles.cache.get(ayarlar.jailyetki) && !message.member.hasPermission('ADMINISTRATOR')) return message.react(ayarlar.carpi)
    let embed = new MessageEmbed().setColor('RANDOM')

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let user = message.guild.member(member)
    let reason = args.splice(1).join(" ") || "Belirtilmedi."
    if (!user) return message.channel.send(embed.setDescription(`${message.author} kime ceza vereceğini yazmadın! \`.jail kişi/ID <süre> <sebep>\``).setTimestamp().setFooter(ayarlar.footer)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))

    if (user.id === message.author.id) return message.react(ayarlar.carpi)
    if (user.id === client.user.id) return message.react(ayarlar.carpi)
    if (user.roles.highest.position >= message.member.roles.highest.position) return message.react(ayarlar.carpi)
    if (user.hasPermission(8)) return message.react(ayarlar.carpi)

    let atilanAy = moment(Date.now()).format("MM");
    let atilanSaat = moment(Date.now()).format("HH:mm:ss");
    let atilanGün = moment(Date.now()).format("DD");
    let jailAtılma = `${atilanGün} ${atilanAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${atilanSaat}`;

    let cezaID = db.get(`cezaid.${message.guild.id}`) + 1
    let puan = await kdb.fetch(`cezapuan.${user.id}`) || "0"
    let durum = await kdb.get(`durum.${user.id}.jail`)
    if (durum) return message.channel.send(embed.setDescription(`Kullanıcı zaten karantinada.`).setTimestamp().setFooter(ayarlar.footer)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 6999 }))

    user.roles.set([ayarlar.cezalırol])
    message.react(ayarlar.onay)
    message.channel.send(embed.setDescription(`${user} kullanıcısı ${message.author} tarafından \`${reason}\` sebebiyle karantinaya postalandı.`).setTimestamp().setImage(`https://c.tenor.com/wHi2lPbSz0sAAAAC/cell-prison.gif`).setFooter(ayar.footer)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))

    db.add(`cezaid.${message.guild.id}`, +1)
    db.add(`ceza.${message.author.id}.jail`, 1)
    kdb.add(`cezapuan.${user.id}`, 15)
    kdb.push(`sicil.${user.id}`, { userID: user.id, adminID: message.author.id, Tip: "Karantina", start: jailAtılma, cezaID: cezaID })
    kdb.set(`durum.${user.id}.jail`, true)
    client.channels.cache.get(ayarlar.jaillog).send(embed.setDescription(`
    
    \`•\` Ceza ID: \`${cezaID}\`
    \`•\` Karantinalanan Kullanıcı: ${user} (\`${user.id}\`)
    \`•\` Karantinalayan Yetkili: ${message.author} (\`${message.author.id}\`)
    \`•\` Karantina Sebebi: \`${reason}\`
    \`•\` Karantina Tarihi: \`${jailAtılma}\`
`).setFooter(ayarlar.footer).setTimestamp())}

exports.conf = {
    aliases: ['karantina'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'jail',
    açıklama:"",
    komut: "[jail]",
    help: "jail ",
    cooldown: 0

  };