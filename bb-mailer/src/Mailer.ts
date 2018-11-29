import * as aws from "aws-sdk";
import * as nodemailer from "nodemailer";
const Email = require('email-templates');

// setup/config stuff
aws.config.loadFromPath("./config.json");
var transporter = nodemailer.createTransport({
	SES: new aws.SES({
		apiVersion: '2010-12-01'
	})
});
var email = new Email({
	send: true,				// Set false to test in dev
	preview: false,			// Set true to preview emails
	transport: transporter
});

// templates
var greeting = {
	template: 'greeting',	// template is based off folder name in emails
	message: {
		from: 'no-reply@bbread.org',
		to: 'jonathan.wang1996@gmail.com'
	},
	locals: {
		name: 'Jon'			// variables used for pug files
	}
}
var testing = {
	template: 'testing',	// template is based off folder name in emails
	message: {
		from: 'no-reply@bbread.org',
		to: 'jonathan.wang1996@gmail.com'
	},
	locals: {
		var1: 'Test variable 1',	// variables used for pug files
		var2: 'Test variable 2'
	}
}

// send email
function sendEmail(opt: any) {
	email.send(opt).then(console.log).catch(console.error);
}
sendEmail(greeting);
sendEmail(testing);