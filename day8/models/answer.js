// models/quizAnswer.js
module.exports = (sequelize, DataTypes) => {
	const answer = sequelize.define(
		"answer",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			answer: DataTypes.STRING,
			question_id: {
				type: DataTypes.INTEGER,
				// allowNull: false,
			},
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "answer",
			underscored: true,
		}
	);

	return answer;
};
