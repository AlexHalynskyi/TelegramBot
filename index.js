const TelegramBot = require('node-telegram-bot-api');

const anonToken = require('dotenv').config()

const token = process.env.AUTH_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const photo = require('./photolist.js');

const keyboard = [
    [
        {
            text: 'New photo',
            callback_data: 'returnPhoto',
        }
    ],
    [
        {
            text: 'Write to author in TG',
            url: 'https://t.me/trytoguesswhoiam',
        }
    ]
];

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    const personName = msg.from.first_name

    bot.sendMessage(chatId, `Hello, ${personName}! What do you want?`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

function randomPhoto () {
    return Math.floor(Math.random() * photo.list.length)
};

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    let img = '';

    if (query.data === 'returnPhoto') {
        img = `assets/${photo.list[randomPhoto()]}`;
    }

    if (img) {
        bot.sendPhoto(chatId, img, {
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } else {
        bot.sendMessage(chatId, 'Sorry, something went wrong, let`s try again?', {
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    }
});

require('http').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
})


