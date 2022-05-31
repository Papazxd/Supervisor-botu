const ayarlar = require('../ayarlar.json');
module.exports = {
    name: 'ready',
    execute(client) {
    client.user.setPresence({ activity: {
       name: ayarlar.status ,type: "PLAYING"}, status: "online"})
    client.channels.cache.get(ayarlar.VoiceChannel).join(ayarlar.voicechannel)
 }
     }