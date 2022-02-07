module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define(
    "location",
    {
      name: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "location",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return location;
};