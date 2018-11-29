"use strict";
exports.__esModule = true;
var aws = require("aws-sdk");
var nodemailer = require("nodemailer");
var Email = require('email-templates');
// setup/config stuff
aws.config.loadFromPath("./config.json");
var transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});
var email = new Email({
    send: true,
    preview: false,
    transport: transporter
});
// templates
var greeting = {
    template: 'greeting',
    message: {
        from: 'no-reply@bbread.org',
        to: 'jonathan.wang1996@gmail.com'
    },
    locals: {
        name: 'Jon' // variables used for pug files
    }
};
var testing = {
    template: 'testing',
    message: {
        from: 'no-reply@bbread.org',
        to: 'jonathan.wang1996@gmail.com'
    },
    locals: {
        var1: 'Test variable 1',
        var2: 'Test variable 2'
    }
};
// send email
function sendEmail(opt) {
    email.send(opt).then(console.log)["catch"](console.error);
}
sendEmail(greeting);
sendEmail(testing);
