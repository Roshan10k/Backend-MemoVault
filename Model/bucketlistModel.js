const { DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");

const BucketList = sequelize.define("BucketItem", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM("to-do", "done"),
      defaultValue: "to-do",
    },
});

module.exports = BucketList;
