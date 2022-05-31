const { Client, MessageEmbed, Collection } = require("discord.js");
const Discord = require("discord.js");
const client = global.client = new Discord.Client();
const db = require("quick.db");
const fs = require("fs");
const ms = require("ms");
const moment = require("moment");
const chalk = require('chalk');
const ayarlar = require("./ayarlar.json");
require("moment-duration-format");

client.cooldown = new Map();

var prefix = ayarlar.prefix;
client.cooldowns = new Discord.Collection();

const log = (message) => {
  console.log(chalk.red`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  log(chalk.white`${files.length} komut yüklenecek.`);
  files.forEach((f) => {
    let props = require(`./commands/${f}`);
    log(chalk.blue`Yüklenen komut | [${props.help.name}]`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach((alias) => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = (command) => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./commands/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  log(chalk.red`Yüklenen eventler | [${event.name}]`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


client.elevation = (message) => {
  if (!message.guild) {
    let perm = 2;
    ayarlar.owner.forEach((a) => {
      if (a == message.author.id) perm = 5;
    });
    return perm;
  }
  let permlvl = 0;
  if (message.member.hasPermission("CREATE_INSTANT_INVITE")) permlvl = 2;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 4;
  if (message.author.id === ayarlar.owner) permlvl = 5;
  return permlvl;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Date.prototype.toTurkishFormatDate = function (format) {
    let date = this,
      day = date.getDate(),
      weekDay = date.getDay(),
      month = date.getMonth(),
      year = date.getFullYear(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();
  
    let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
    let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");
  
    if (!format) {
      format = "dd MM yyyy | hh:ii:ss";
    };
    format = format.replace("mm", month.toString().padStart(2, "0"));
    format = format.replace("MM", monthNames[month]);
    
    if (format.indexOf("yyyy") > -1) {
      format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
      format = format.replace("yy", year.toString().substr(2, 2));
    };
    
    format = format.replace("dd", day.toString().padStart(2, "0"));
    format = format.replace("DD", dayNames[weekDay]);
  
    if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
    if (format.indexOf("hh") > -1) {
      if (hours > 24) hours -= 24;
      if (hours === 0) hours = 24;
      format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
    };
    if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
    if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
    return format;
  };
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
process.on('uncaughtException', function(err) { 
    console.log(err) 
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("message", message => {
    let embed = new MessageEmbed()
    if (!message.guild) return;
    if (message.content.includes(`afk`)) return;
    let etiket = message.mentions.users.first()
    let uye = db.fetch(`user_${message.author.id}_${message.guild.id}`)
    let nickk = db.fetch(`nick_${message.author.id}_${message.guild.id}`)
    if (etiket) {
        let reason = db.fetch(`sebep_${etiket.id}_${message.guild.id}`)
        let uye2 = db.fetch(`user_${etiket.id}_${message.guild.id}`)
        if (message.content.includes(uye2)) {
            let time = db.fetch(`afktime_${message.guild.id}`);
            let timeObj = ms(Date.now() - time);
            message.channel.send(embed.setDescription(`${etiket} adlı kullanıcı **${reason}** sebebiyle \`${timeObj}\` süresi boyunca afk.`).setColor("#2F3136")).then(x => x.delete({timeout: 5000}))
        }
    }
    if (message.author.id === uye) {
        message.member.setNickname(nickk)
        db.delete(`sebep_${message.author.id}_${message.guild.id}`)
        db.delete(`user_${message.author.id}_${message.guild.id}`)
        db.delete(`nick_${message.author.id}_${message.guild.id}`)
        db.delete(`user_${message.author.id}_${message.guild.id}`);
        db.delete(`afktime_${message.guild.id}`)
        message.reply(`Başarıyla \`AFK\` modundan çıkış yaptın.`).then(x => x.delete({timeout: 5000}))
    }
  })
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
client.on('voiceStateUpdate', (oldMember, newMember) => {
    { 
      const voicelog = ayarlar.seslog
      let giriş = client.channels.cache.get(voicelog);
      let çıkış = client.channels.cache.get(voicelog);
      let odadeğişme = client.channels.cache.get(voicelog);
      let logKanali = client.channels.cache.get(voicelog);
      let susturma = client.channels.cache.get(voicelog);
      let sağırlaştırma = client.channels.cache.get(voicelog);
    
      if (oldMember.channelID && !oldMember.serverMute && newMember.serverMute) return logKanali.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda yetkili tarafından **susturdu!**`).catch();
      if (!oldMember.channelID && newMember.channelID) return giriş.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanala **katıldı!**`).catch();
      if (oldMember.channelID && !newMember.channelID) return çıkış.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(oldMember.channelID).name}\` adlı sesli kanaldan **ayrıldı!**`).catch();
      if (oldMember.channelID && newMember.channelID && oldMember.channelID != newMember.channelID) return odadeğişme.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi ses kanalını **değiştirdi!** (\`${newMember.guild.channels.cache.get(oldMember.channelID).name}\` => \`${newMember.guild.channels.cache.get(newMember.channelID).name}\`)`).catch();
      if (oldMember.channelID && oldMember.selfMute && !newMember.selfMute) return susturma.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda kendi susturmasını **kaldırdı!**`).catch();
      if (oldMember.channelID && !oldMember.selfMute && newMember.selfMute) return susturma.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda kendini **susturdu!**`).catch();
      if (oldMember.channelID && oldMember.selfDeaf && !newMember.selfDeaf) return sağırlaştırma.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda kendi sağırlaştırmasını **kaldırdı!**`).catch();
      if (oldMember.channelID && !oldMember.selfDeaf && newMember.selfDeaf) return sağırlaştırma.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda kendini **sağırlaştırdı!**`).catch();
    };
    }); 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on('messageDelete', (message) => {
    if (!message.guild || message.author.bot) return;
    const embed = new Discord.MessageEmbed()
        .setAuthor("Mesaj Silindi", message.author.avatarURL({ dynamic: true }))
        .addField("**Mesaj Sahibi**", `${message.author.tag}`, true)
        .addField("**Mesaj Kanalı**", `${message.channel}`, true)
        .addField("**Mesaj Silinme Tarihi**", `**${moment().format('LLL')}**`, true)
        .setDescription(`**Silinen mesaj:** \`${message.content.replace("`", "")}\``)
        .setTimestamp()
        .setColor("#00a3aa")
        .setFooter("Mesaj silindiği saat:")
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
    client.channels.cache.get(ayarlar.mesajlog).send(embed)
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  client.on("messageDelete", async (message) => {
    if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
    let snipe = {
        mesaj: message.content,
        mesajyazan: message.author.id,
        ytarihi: message.createdTimestamp,
        starihi: Date.now(),
        kanal: message.channel.id
    }
    await db.set(`snipe.${message.guild.id}`, snipe)
  });
  
  
  client.on("messageDelete", async message => {
    if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
    await db.set(`snipe.${message.guild.id}.${message.channel.id}`, { yazar: message.author.id, yazilmaTarihi: message.createdTimestamp, silinmeTarihi: Date.now(), dosya: message.attachments.first() ? true : false });
    if (message.content) db.set(`snipe.${message.guild.id}.${message.channel.id}.icerik`, message.content);
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("userUpdate", async function(oldUser, newUser) { 
    const db = require('quick.db');
    let tag = (ayarlar.tag)
    const roleID = (ayarlar.taglırol)
     const guildID = (ayarlar.sunucuid)
    const chat = (ayarlar.chat)
    const log2 = (ayarlar.taglog)
    const guild = client.guilds.cache.get(guildID)
    const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
    const member = guild.members.cache.get(newUser.id)
    if (newUser.username !== oldUser.username) {
        if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
            member.roles.set(ayarlar.kayıtsızRolleri)
            member.roles.remove(roleID)
            member.setNickname(`Kayıtsız`)
            db.delete(`isimler_${member.user.id}`)
            db.delete(`kayıt_${member.id}`)
            client.channels.cache.get(log2).send(`${newUser} Adlı kişi isminden **${tag}** sildi \n \`Alınan Rol:\` \`#Of Best\` \n\n \`Kişi Bilgileri;\` \n \`Kişi İd:\` ${newUser.id} \n \`Kişi İsmi:\` ${newUser.tag} \n \`Kişi Etiketi:\` ${newUser} \n  \n\n \`Kişinin Eski İsimi:\` ${oldUser.tag} \n \`Kişinin Yeni İsimi:\` ${newUser.tag}`)
        } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
            member.roles.add(roleID)
            client.channels.cache.get(chat).send(` ${newUser} \` Tag aldı selam verin.\``).then(x => x.delete({timeout: 10000})) 
            client.channels.cache.get(log2).send(`${newUser} Adlı kişi ismine **${tag}** tagını aldı \n \`Verilen Rol:\` \`#Of Best\` \n\n \`Kişi Bilgileri;\` \n \`Kişi İd:\` ${newUser.id} \n \`Kişi İsmi:\` ${newUser.tag} \n \`Kişi Etiketi:\` ${newUser} \n  \n\n \`Kişinin Eski İsimi:\` ${oldUser.tag} \n \`Kişinin Yeni İsimi:\` ${newUser.tag}`)
        }
    }
   
  }) 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  
  client.on("guildMemberAdd", member => {
    let sunucuid = (config.sunucuid); 
    let tag = (ayarlar.tag);
    let rol = (ayarlar.taglırol); 
  if(member.user.username.includes(tag)){
  member.roles.add(rol)
    const tagalma = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setDescription(`<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı.`)
        .setTimestamp()
       client.channels.cache.get(ayarlar.taglog).send(tagalma)
  }
  })
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  client.on("guildMemberAdd", member => {

    let yasakli = [ayarlar.yasaklıtag] // yasaklı tagları buraya yazin
    
    if(member.user.username.includes(yasakli)) {
      member.kick()
      member.guild.channels.cache.get(ayarlar.yasaklılog).send("Oruspu Cocogu Girme Bu Sunucuya Sikdir git")
    }
  });


client.login(ayarlar.token).then(x => console.log(`Bot  olarak giriş yaptı!`)).catch(err => console.error(` - Bot giriş yapamadı | Hata: ${err}`))