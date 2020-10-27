const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our User model
class User extends Model { }

//define table columns + configuration
User.init(
    {
        //table column defs

        //id column
        id: {
            //tell what type of data, using Squelize DataTypes object
            type: DataTypes.INTEGER,
            //this is equivalent of SQL's NOT NULL option
            allowNull: false,
            //tell it that it's PRIMARY KEY
            primaryKey: true,
            //turn ON autoincrement
            autoIncrement: true
        },
        //define username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //no duplicate email values in the tables
            unique: true,
            //since allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //PW must be min 4 char long
                len: [4]
            }
        }
    },
    {
        //table config options go here 

        //encrypt user password
        hooks: {
            //set up beforeCreate lifecycle "hook" functionality for NEW user
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            //set up beforeCreate lifecycle "hook" functionality for UPDATED user
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //pass in our imported seq. connection (dir connect to our database)
        sequelize,
        //don't auto create createdAt/updatedAt timestamp fields
        timestamps: false,
        //don't puralize name of database table
        freezeTableName: true,
        //use understores as opposed to camel-casing
        underscored: true,
        //make our model name stay LOWERCASE in the database
        modelName: 'user'
    }
);

module.exports = User;