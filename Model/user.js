const {Datatypes} = require('sequelize')
const sequelize = require('./database/db.js')

const Test = sequelize.define('MemoVault',{
    id:{
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    name: {
        type: Datatypes.STRING,
        allowNull: false,

    },
    email: {
        type: Datatypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = Test;