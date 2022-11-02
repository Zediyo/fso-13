const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const router = require("express").Router()

const { SECRET } = require("../util/config")
const { User, Token } = require("../models")
const { tokenExtractor } = require("../util/middleware")

router.delete('/', tokenExtractor, async (request, response) =>
{
	const dbToken = await Token.findOne({ where: { userId: request.decodedToken.id }})

	await dbToken.destroy()
	response.status(204).end()
})

module.exports = router