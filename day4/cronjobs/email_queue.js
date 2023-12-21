const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("../models");

cron.schedule("0 0 * * *", async () => {
	try {
		const users = await db.user.findAll({
			where: {
				status: "active",
			},
		});

		const today = new Date();
		const isMondayWednesdayFriday =
			today.getDay() % 2 === 1 && today.getDay() !== 0;

		const emailsToSend = isMondayWednesdayFriday
			? await db.email.findAll({
					where: {
						status: "active",
						id: {
							[Op.and]: [
								{
									[Op.mod]: [
										db.sequelize.literal('"email"."id"'),
										2,
									],
								},
								{
									[Op.or]: [
										{
											[Op.mod]: [
												db.sequelize.literal(
													"EXTRACT(DOW FROM current_date)"
												),
												2,
											],
										},
										{
											[Op.eq]: [
												db.sequelize.literal(
													"EXTRACT(DOW FROM current_date)"
												),
												0,
											],
										},
									],
								},
							],
						},
					},
			  })
			: await db.email.findAll({
					where: {
						status: "active",
						id: {
							[Op.and]: [
								{
									[Op.mod]: [
										db.sequelize.literal('"email"."id"'),
										2,
									],
								},
								{
									[Op.not]: [
										{
											[Op.or]: [
												{
													[Op.mod]: [
														db.sequelize.literal(
															"EXTRACT(DOW FROM current_date)"
														),
														2,
													],
												},
												{
													[Op.eq]: [
														db.sequelize.literal(
															"EXTRACT(DOW FROM current_date)"
														),
														0,
													],
												},
											],
										},
									],
								},
							],
						},
					},
			  });

		for (const user of users) {
			for (const email of emailsToSend) {
				await db.email_queue.create({
					email_id: email.id,
					user_id: user.id,
					status: "not sent",
					send_at: new Date(
						today.getFullYear(),
						today.getMonth(),
						today.getDate() + 1
					),
				});
			}
		}

		console.log("Emails added to queue successfully.");
	} catch (error) {
		console.error("Error in email_queue cron job:", error);
	}
});
