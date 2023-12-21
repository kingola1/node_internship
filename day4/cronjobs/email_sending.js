const cron = require("node-cron");
const nodemailer = require("nodemailer");
const db = require("../models");

const transporter = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "ab1536627e2e10",
		pass: "b135db8f11d7fd",
	},
});

cron.schedule("0 0 * * *", async () => {
	try {
		const today = new Date();
		const emailsToSend = await db.email_queue.findAll({
			where: {
				send_at: {
					[Op.and]: [
						{ [Op.lte]: today },
						{
							[Op.gt]: new Date(
								today.getFullYear(),
								today.getMonth(),
								today.getDate() + 1
							),
						},
					],
				},
				status: "not sent",
			},
			include: [
				{
					model: db.email,
					as: "email",
					attributes: ["subject", "body"],
				},
				{
					model: db.user,
					as: "user",
					attributes: ["name", "email"],
				},
			],
		});

		for (const emailToSend of emailsToSend) {
			const { subject, body } = emailToSend.email;
			const { name, email } = emailToSend.user;

			const mailOptions = {
				from: "segun8427@gmail.com",
				to: email,
				subject: subject
					.replace("{{{NAME}}}", name)
					.replace("{{{EMAIL}}}", email),
				text: body
					.replace("{{{NAME}}}", name)
					.replace("{{{EMAIL}}}", email),
			};

			await transporter.sendMail(mailOptions);
			await emailToSend.update({ status: "sent" });
		}

		console.log("Emails sent successfully.");
	} catch (error) {
		console.error("Error in email_sending cron job:", error);
	}
});
