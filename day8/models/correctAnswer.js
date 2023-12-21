// models/correctAnswer.js
module.exports = (sequelize, DataTypes) => {
	const correctAnswer = sequelize.define(
		"correct_answer",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			answer_id: {
				type: DataTypes.INTEGER,
				// allowNull: false,
			},
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "correct_answer",
			underscored: true,
		}
	);

	return correctAnswer;
};
