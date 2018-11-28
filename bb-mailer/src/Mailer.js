"use strict";
exports.__esModule = true;
var aws = require("aws-sdk");
var nodemailer = require("nodemailer");
aws.config.loadFromPath("./config.json");
var transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});
transporter.sendMail({
    from: 'no-reply@bbread.org',
    to: 'jonathan.wang1996@gmail.com',
    subject: 'Test Subject',
    html: 'Hello World!'
}, function (err, data) {
    if (err)
        console.log(err, err.stack);
    else
        console.log(data);
});
