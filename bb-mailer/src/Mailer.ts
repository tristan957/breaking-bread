import * as aws from "aws-sdk";
import * as EmailTemplate from "email-templates";
import * as nodemailer from "nodemailer";

// setup/config stuff
aws.config.loadFromPath(`${__dirname}/../ses.config.json`);
const transporter = nodemailer.createTransport({
	SES: new aws.SES({
		apiVersion: "2010-12-01",
	}),
});

interface IEmailOptions {
	/**
	 * The template name
	 */
	template: string;
	/**
	 * Nodemailer Message <Nodemailer.com/message/>
	 */
	message: any;
	/**
	 * The Template Variables
	 */
	locals: any;
}

// templates
const greeting = {
	template: `${__dirname}/emails/greeting`,	// template is based off folder name in emails
	message: {
		from: "no-reply@bbread.org",
		to: "gregnoonan@tamu.edu",
	},
	locals: {
		name: "Jon",		// variables used for pug files
	},
};

const testing = {
	template: `${__dirname}/emails/testing`,	// template is based off folder name in emails
	message: {
		from: "no-reply@bbread.org",
		to: "gregnoonan@tamu.edu",
	},
	locals: {
		var1: "Test variable 1",	// variables used for pug files
		var2: "Test variable 2",
	},
};

// send email
function sendEmail(message: IEmailOptions): void {
	const mailer: EmailTemplate = new EmailTemplate.default({
		message: "",
		send: true,				// Set false to test in dev
		preview: false,			// Set true to preview emails
		transport: transporter,
	});

	mailer.send(message).then(console.log).catch(console.error);
}

sendEmail(greeting);
sendEmail(testing);
