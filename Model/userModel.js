const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');

const Users = sequelize.define('Users', {
    UserID: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
    },
    Email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    RegistrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = Users;
