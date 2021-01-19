require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;
const URL = process.env.URL;

const config = require('./config.json');

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    console.log(config);
});

bot.on('message', msg => {
    if (msg.content.startsWith('!gk connect')) {
        registerGuild(msg);
        sendHelp(msg);
    }

    // if (msg.content.startsWith(prefix)) {
    //     const action = msg.content.split(' ')[1];
    //     // msg.channel.send(msg.content.split(' ')[2]);
        
    //     // createChannel(msg);
    // }
});

function sendHelp(msg) {
    msg.channel.send('To begin receiving Glo notifications, create a webhook in Glo that points to `' + URL + '/webhook/' + msg.guild.id + '`.');
}

function registerGuild(msg) {
    msg.guild.channels.create('Glo Notifications', {
    type: 'category',
    permissionOverwrites: [
        {
            id: msg.guild.id,
            allow: ['VIEW_CHANNEL'],
        }]
    }).then(cat => {
        config.push({
            guild: {
                id: msg.guild.id,
                name: msg.guild.name
            },
            contact: {
                id: msg.guild.ownerID,
                name: "UNDEFINED"
            },
            msg: msg,
            categoryId: cat.id,
            channels: []
        });
    })
    
}

function createChannel(msg, categoryId, name) {
    return msg.guild.channels.create(name, {
    type: 'text',
    parent: categoryId,
    permissionOverwrites: [
        {
            id: msg.guild.id,
            allow: ['VIEW_CHANNEL'],
        }]
    });
}

function sendMessage(channelId, webhook) {
    switch (webhook.action) {
        case 'added':
            if (webhook.card) {
                bot.channels.cache.get(channelId).send('The card "' + webhook.card.name + '" was created on ' + webhook.board.name);
            }
            if (webhook.column) {
                bot.channels.cache.get(channelId).send('The column "' + webhook.column.name + '" was created on ' + webhook.board.name);
            }
            return;
        case 'updated':
            bot.channels.cache.get(channelId).send('The card "' + webhook.card.name + '" was updated on ' + webhook.board.name);
            return
        default:
            bot.channels.cache.get(channelId).send('Hello here!');
    }
    if (webhook.action === 'added') {
        
    } else if {
        
    }
    
}


const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/webhook/:guildId', (req, res) => {

    const guild = config.find(i => i.guild.id === req.params.guildId);

    const channel = guild.channels.find(i => i.name === req.body.board.name);
    if (!channel) {
        createChannel(guild.msg, guild.categoryId, req.body.board.name).then(c => {
            sendMessage(c.id, req.body);
        })
    } else {
        sendMessage(channel.id, req.body)
    }


    // client.channels.get('CHANNEL ID').send('Hello here!');

    console.log(req.body);
    res.send('An alligator approaches!');
});

app.listen(3000, () => console.log('Gator app listening on port 3000!'));