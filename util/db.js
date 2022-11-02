const Sequelize = require("sequelize")
const { DATABASE_URL } = require("./config")

const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () =>
{
	try
	{
		await sequelize.authenticate()
		console.log("Database connection successful")
	}
	catch ( error )
	{
		console.log("Failed to connect to database", error)
		return process.exit(1)
	}

	return null
}

module.exports = { connectToDatabase, sequelize }