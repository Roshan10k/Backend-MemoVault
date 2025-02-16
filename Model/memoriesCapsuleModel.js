const { DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");

const Memory = sequelize.define(
  "Memory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Image URL (can be null)
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    openDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = Memory;
