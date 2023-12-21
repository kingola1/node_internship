module.exports = (sequelize, DataTypes) => {
	const email = sequelize.define(
		"email",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			slug: {
				type: DataTypes.STRING,
				unique: true,
			},
			subject: DataTypes.STRING,
			body: DataTypes.TEXT,
			status: {
				type: DataTypes.ENUM("active", "inactive"),
			},
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "email",
		}
	);

	return email;
};
