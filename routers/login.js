const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const router = require("express").Router()

const { SECRET } = require("../util/config")
const { User, Token } = require("../models")

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

	if ( user.disabled )
		return response.status(401).json({ error: "user disabled" })

	const bPass = await bcrypt.compare(password, user.hash)
	if ( !bPass )
		return response.status(401).json({ error: "invalid password" })

	
	let token = await Token.findOne({ where: { userId: user.id }})

	if ( !token )
	{
		const userForToken =
		{
			username: user.username,
			id: user.id,
		}
	
		const secret = "1234" + new Date().getTime()
	
		token = jwt.sign(userForToken, secret)

		const newToken =
		{
			userId: user.id,
			token,
			secret
		}

		await Token.create(newToken)

		console.log("creating new token")
	}
	else
	{
		console.log("using old token")
	}

	response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router