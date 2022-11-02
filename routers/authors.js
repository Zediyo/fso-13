const router = require("express").Router()
const { Op, Sequelize } = require('sequelize')

const { tokenExtractor } = require("../util/middleware")
const { Blog } = require("../models")
const { User } = require("../models")

router.get("/", async (req, res) =>
{
	const blogs = await Blog.findAll({
		attributes:
		[
			"author",
			[Sequelize.fn('COUNT', 'author'), 'blogs'],
			[Sequelize.fn('sum', Sequelize.col('likes')), 'likes']
		],
		group: ["author"],
		order: [ [ "likes", "DESC" ] ]
	})

	res.json(blogs)
})

module.exports = router