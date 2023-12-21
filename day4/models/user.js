module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		"user",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
			},
			name: DataTypes.STRING,
			status: {
				type: DataTypes.ENUM("active", "inactive"),
			},
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "user",
		}
	);

	return user;
};
