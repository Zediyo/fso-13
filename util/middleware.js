const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User, Token } = require("../models")

const checkTokenValidity = async (token) =>
{
	const dbToken = await Token.findOne({ where: { token }})
	
	if ( !dbToken )
		return {}

	const user = await User.findByPk(dbToken.userId)
	
	if ( !user || user.disabled )
	{
		await dbToken.destroy()
		return {}
	}

	return { found: true, secret: dbToken.secret }
}

const tokenExtractor = async (req, res, next) =>
{
	const authorization = req.get("authorization")

	if ( authorization && authorization.toLowerCase().startsWith("bearer ") )
	{
		try
		{
			const token = authorization.substring(7)
			console.log(token)

			const result = await checkTokenValidity(token)
			//console.log("TOKEN_RESULT:", result)

			if ( result.found )
				req.decodedToken = jwt.verify(token, result.secret)
			else
				return res.status(401).json({ error: "token invalid" })
		}
		catch (error)
		{
			console.log(error)
			return res.status(401).json({ error: "token invalid" })
		}
	}
	else
	{
		return res.status(401).json({ error: "token missing" })
	}

	next()
}

const errorHandler = (error, request, response, next) =>
{
	console.error(error.name, error.message)

	switch(error.name)
	{
		case "SequelizeValidationError": return response.status(400).send({ error: error.errors.map(e => e.message) })
		case "SequelizeDatabaseError": return response.status(400).send({ error: error.message })
	}

	next(error)
}

module.exports = { tokenExtractor, errorHandler }