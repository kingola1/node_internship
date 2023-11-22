module.exports = (sequelize, DataTypes) => {
	const order = sequelize.define(
		"order",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: DataTypes.INTEGER,
			amount: DataTypes.DECIMAL(10, 2),
			tax: DataTypes.INTEGER,
			notes: DataTypes.STRING,
			status: {
				type: DataTypes.ENUM("paid", "not paid"),
			},
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "order",
		},
		{
			underscoredAll: false,
			underscored: false,
		}
	);

	return order;
};
