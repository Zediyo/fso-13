const Sequelize = require("sequelize")
const { DATABASE_URL } = require("./config")
const { Umzug, SequelizeStorage } = require("umzug")

const sequelize = new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, });

const migrationConfig =
{
	migrations: { glob: "migrations/*.js", },
	storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
	context: sequelize.getQueryInterface(),
	logger: console,
}

const runMigrations = async () =>
{
	const migrator = new Umzug(migrationConfig)

	const migrations = await migrator.up()

	console.log('Migrations up to date', { files: migrations.map((mig) => mig.name) })
}

const rollbackMigration = async () =>
{
	await sequelize.authenticate()

	const migrator = new Umzug(migrationConfig)

	await migrator.down()
}

const connectToDatabase = async () =>
{
	try
	{
		await sequelize.authenticate()
		await runMigrations()
		console.log("Database connection successful")
	}
	catch ( error )
	{
		console.log("Failed to connect to database", error)
		return process.exit(1)
	}

	return null
}



module.exports = { connectToDatabase, sequelize, rollbackMigration }