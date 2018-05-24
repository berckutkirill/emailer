const express = require('express');
const fs = require('fs');

const router = express.Router();
const nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/send', function (req, res) {
    const email = req.body.email;
    let body;
    let subject;
    switch (req.body.letter) {
        case "0": {
            body = fs.readFileSync('emails/sayNo.html');
            subject = 'Рассмотрели заявку';
            break;
        }
        case "1": {
            body = fs.readFileSync('emails/sayYes.html');
            subject = 'Рассматриваем заявку';
            break;
        }
        case "2": {
            body = fs.readFileSync('emails/sayBrif.html');
            subject = 'Дополнительная информация по заявке';
            break;
        }
        default: {
            body = false;
        }
    }
    if (!body) {
        return;
    }
    let transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'manager@cheshire-cat.by', // generated ethereal user
            pass: 'Nabs64gw' // generated ethereal password
        }
    });

    let mailOptions = {
        from: '"CheshireCat" <manager@cheshire-cat.by>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.render('error', { title: 'Express' });
        } else {
            res.render('ok', { title: 'Express' });
        }
    });
});

module.exports = router;
