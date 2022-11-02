const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const tokenExtractor = (req, res, next) =>
{
	const authorization = req.get("authorization")

	if ( authorization && authorization.toLowerCase().startsWith("bearer ") )
	{
		try
		{
			console.log(authorization.substring(7))
			req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
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
	}

	next(error)
}

module.exports = { tokenExtractor, errorHandler }