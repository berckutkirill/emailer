const fs = require('fs');
const nodemailer = require('nodemailer');
const notifier = require('mail-notifier');
var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
    user: "manager@cheshire-cat.by",
    password: "Nabs64gw",
    host: "imap.yandex.ru",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
});

imap.once('ready', function() {
    console.log("Ready");
    var conn = {
        user: "manager@cheshire-cat.by",
        password: "Nabs64gw",
        host: "imap.yandex.ru",
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    };
    notifier(conn).on('mail', function(mail) {
        parseMail(mail);
    }).start();
});

imap.once('error', function(err) {
    console.log("Inside Error");
    console.log(err);
});

imap.once('end', function() {
    console.log('Connection ended');
});

imap.connect();

function parseMail(mail) {
    try {
        if(mail.from[0].address !== "manager@cheshire-cat.by") {
            return;
        }
        mail.html = mail.html.replace(/\n/g, "");
        mail.html = mail.html.replace(/<br>/g, "");
        mail.html = mail.html.replace(/<br \/>/g, "");
        const name = mail.html.match(/Имя:&nbsp; &nbsp;(.*?)<\/b/)[1];
        const phone = mail.html.match(/Телефон:&nbsp; &nbsp;(.*?)<\/b/)[1];
        const message = mail.html.match(/Сообщение:&nbsp; &nbsp;(.*?)<\/b>/)[1];
        const email = mail.html.match(/Email:&nbsp; &nbsp;(.*?)<\/b>/)[1];
        if(email) {
            sendAnswer(email);
            console.log(message, name, phone, email);
        }
    } catch (e) {
        console.log(e);
    }
}
function sendAnswer(email) {
    const body = fs.readFileSync('emails/first.html');

    let transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'manager@cheshire-cat.by', // generated ethereal user
            pass: 'Nabs64gw' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Чеширский Кот" <manager@cheshire-cat.by>', // sender address
        to: email, // list of receivers
        subject: 'Приняли заявку', // Subject line
        html: body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}