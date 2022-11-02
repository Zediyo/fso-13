const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const router = require("express").Router()

const { SECRET } = require("../util/config")
const User = require("../models/user")

router.post('/', async (request, response) =>
{
	const { username, password } = request.body

	const user = await User.findOne(
	{
		where:
		{
			username
		}
	})

	if ( !user )
		return response.status(401).json({ error: "invalid username" })

	const bPass = await bcrypt.compare(password, user.hash)
	if ( !bPass )
		return response.status(401).json({ error: "invalid password" })

	const userForToken =
	{
		username: user.username,
		id: user.id,
	}

	const token = jwt.sign(userForToken, SECRET)

	response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router