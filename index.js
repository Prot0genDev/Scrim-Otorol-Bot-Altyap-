const { Client, GatewayIntentBits, Events, PermissionsBitField } = require('discord.js');
const fs = require('fs');
// MadeByProt0gen
const config = JSON.parse(fs.readFileSync('config.json'));
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // MadeByProt0genDEV
    ]
});
let logChannelId = null;
client.once(Events.ClientReady, () => {
    console.log(`Rollemeye Başladı ${client.user.tag}`);
});
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    // MadeByProt0gen
    if (message.content.startsWith('!log')) {
        const args = message.content.split(' ');
        // MadeByProt0genDEV
        if (args.length < 2 || !message.mentions.channels.size) {
            return message.reply('Lütfen bir kanal etiketleyin. Örnek: `!log #kanalismi`');
        }
        const mentionedChannel = message.mentions.channels.first();
        logChannelId = mentionedChannel.id;
        message.reply(`Log kanalı olarak ${mentionedChannel.name} ayarlandı!`);
    }
    // MadeByProt0gen
    if (message.channel.id === config.CHANNEL_ID) {
        const guild = client.guilds.cache.get(config.GUILD_ID);
        const member = guild.members.cache.get(message.author.id);
        if (member) {
            const oldNickname = member.nickname || message.author.username;
            const newNickname = `${message.content} | ${message.author.username}`;
            try {
                await member.setNickname(newNickname);
                console.log(`Kullanıcının ismi başarıyla güncellendi: ${newNickname}`);
            } catch (error) {
                console.error('Kullanıcı adını güncellerken hata oluştu:', error);
            }
            // Prot0genDEV
            const emoji = `<:${config.EMOJI_NAME}:${config.EMOJI_ID}>`;
            try {
                await message.react(emoji);
                console.log(`Mesaja emoji eklendi: ${emoji}`);
            } catch (error) {
                console.error('Emoji eklenirken hata oluştu:', error);
            }
            // Prot0genDEV
            const role = guild.roles.cache.get(config.ROLE_ID);
            if (role && !member.roles.cache.has(role.id)) {
                try {
                    await member.roles.add(role);
                    console.log(`Kullanıcıya rol başarıyla eklendi: ${role.name}`);
                } catch (error) {
                    console.error('Rol eklerken hata oluştu:', error);
                }
            }
            // Prot0genDevOtorolBotu
            if (logChannelId) {
                const logChannel = guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send(`İsmi değişen kişi: <@${message.author.id}>\nEski ismi: ${oldNickname}\nYeni ismi: ${newNickname}`);
                }
            }
        }
    }
});
client.login(config.TOKEN);