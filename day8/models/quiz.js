// models/quiz.js
module.exports = (sequelize, DataTypes) => {
	const quiz = sequelize.define(
		"quiz",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			type: DataTypes.STRING,
			question: DataTypes.STRING,
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "quiz",
			underscored: true,
		}
	);

	return quiz;
};
