module.exports = (sequelize, DataTypes) => {
	const emailQueue = sequelize.define(
		"email_queue",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			email_id: DataTypes.INTEGER,
			user_id: DataTypes.INTEGER,
			status: {
				type: DataTypes.ENUM("send", "not sent"),
			},
			created_at: DataTypes.DATE,
			send_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "email_queue",
		}
	);

	return emailQueue;
};
