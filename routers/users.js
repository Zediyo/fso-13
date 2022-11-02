const bcrypt = require("bcryptjs")
const router = require("express").Router()

const { User } = require("../models")
const { Blog } = require("../models")

router.get("/", async (req, res) =>
{
	const users = await User.findAll({ 
		include:
		{ 
			model: Blog,
			attributes:
			{ 
				exclude: ["userId"]
			}
		},
		attributes:
		{
			exclude: ["hash"]
		},
	})
	res.json(users)
})

router.post("/", async (req, res) =>
{
	const { username, name, password } = req.body

	if ( !username || username.length < 3 )
		return response.status(400).json({ error: "username must be atleast 3 characters long" })

	if ( !password || password.length < 3 )
		return response.status(400).json({ error: "password must be atleast 3 characters long" })

	const saltRounds = 10
	const hash = await bcrypt.hash(password, saltRounds)

	const newUser =
	{
		username,
		name,
		hash,
	}

	const user = await User.create(newUser)

	res.status(201).json(user)
})

router.get("/:id", async (req, res) =>
{
	const user = await User.findByPk(req.params.id, { 
		include:
		{ 
			model: Blog,
			attributes:
			{ 
				exclude: ["userId"]
			}
		},
		attributes:
		{
			exclude: ["hash"]
		},
	})

	res.json(user)
})

router.put("/:username", async (req, res) =>
{
	const user = await User.findOne({
		where:
		{
			username: req.params.username
		}
	})

	if ( user )
	{
		const body = req.body

		if ( body.name )
			user.name = body.name

		await user.save()

		res.json(user)
	}
	else
	{
		res.status(404).end()
	}
})

module.exports = router