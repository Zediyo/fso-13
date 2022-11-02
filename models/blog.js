const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init(
{
	id:
	{
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	author:
	{
		type: DataTypes.TEXT,
	},
	title:
	{
		type: DataTypes.TEXT,
		allowNull: false
	},
	url:
	{
		type: DataTypes.TEXT,
		allowNull: false
	},
	likes:
	{
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	year:
	{
		type: DataTypes.INTEGER,
		allowNull: false,
		validate:
		{
			min:
			{
				args: 1991,
				msg: "Year must be 1991 or greater"
			},
			max:
			{
				args: Number(new Date().getFullYear()),
				msg: "Year can't be greater than current year"
			}
		}
	}
},
{
	sequelize,
	underscored: true,
	timestamps: true,
	modelName: "blog"
})

module.exports = Blog