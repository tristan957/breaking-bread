import * as aws from "aws-sdk";
import * as EmailTemplate from "email-templates";
import * as nodemailer from "nodemailer";

// setup/config stuff
aws.config.loadFromPath(`${__dirname}/../ses.config.json`);
export const transporter = nodemailer.createTransport({
	SES: new aws.SES({
		apiVersion: "2010-12-01",
	}),
});

export const sender = "no-reply@bbread.org";

export enum templates {
	MEAL_CHANGE = "meal_change",
	SIGN_UP = "sign_up",
	USER_KICKED = "user_kicked",
}

export function sendNotification(json: any, template: templates): void {
	const msg = {
		template: `${__dirname}/emails/${template}`,
		message: {
			from: sender,
			to: json.receiver,
		},
		locals: {
			info: json,
		},
	};

	const mailer: EmailTemplate = new EmailTemplate.default({
		message: "",
		send: false,				// Set false to test in dev
		preview: true,			// Set true to preview emails
		transport: transporter,
	});

	mailer.send(msg)
		.then(console.log)
		.catch(console.error);
}

/* Example Usage */
const signUpJson = {
	receiver: "jonathan.wang1996@gmail.com",
	receiver_name: "Jon",
};

const mealChangeJson = {
	receiver: "jonathan.wang1996@gmail.com",
	receiver_name: "Jon",
	host_name: "Grog",
	meal_link: "https://www.google.com",
	old_date: new Date("Sat Dec 01 2018 15:06:25 GMT-0600 (Central Standard Time)").toLocaleDateString(),
	new_date: new Date("Sat Dec 02 2018 15:06:25 GMT-0600 (Central Standard Time)").toLocaleDateString(),
	old_time: new Date("Sat Dec 01 2018 15:06:20 GMT-0600 (Central Standard Time)").toLocaleTimeString(),
	new_time: new Date("Sat Dec 01 2018 15:06:25 GMT-0600 (Central Standard Time)").toLocaleTimeString(),
	old_addr: "8===========D Drive",
	new_addr: "( . ) Y ( . ) Street",
	old_price: 999,
	new_price: 1000,
};

const userKickedJson = {
	receiver: "jonathan.wang1996@gmail.com",
	receiver_name: "Jon",
	host_name: "Grog",
};

sendNotification(signUpJson, templates.SIGN_UP);
sendNotification(mealChangeJson, templates.MEAL_CHANGE);
sendNotification(userKickedJson, templates.USER_KICKED);
