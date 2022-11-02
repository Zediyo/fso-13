const { DataTypes } = require('sequelize')

module.exports =
{
	up: async ({ context: queryInterface }) =>
	{
		await queryInterface.addColumn("users", "disabled",
		{
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		})

		await queryInterface.createTable("tokens",
		{
			id:
			{
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			user_id:
			{
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true,
				references: { model: "users", key: "id" },
			},
			token:
			{
				type: DataTypes.TEXT,
				allowNull: false,
			},
			secret:
			{
				type: DataTypes.TEXT,
				allowNull: false,
			},
			createdAt:
			{
				field: 'created_at',
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt:
			{
				field: 'updated_at',
				allowNull: false,
				type: DataTypes.DATE,
			}
		})
  	},
	down: async ({ context: queryInterface }) =>
	{
		await queryInterface.dropTable("tokens")
	},
}