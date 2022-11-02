const router = require("express").Router()
const { Op, Sequelize } = require('sequelize')

const { tokenExtractor } = require("../util/middleware")
const { Blog } = require("../models")
const { User } = require("../models")
const { Readlist } = require("../models")

router.get("/", async (req, res) =>
{
	const list = await Readlist.findAll()
	res.json(list)
})

router.post("/", async (req, res) =>
{
	const { blog_id, user_id } = req.body

	if ( !blog_id || !user_id )
		return res.status(400).json({ error: "missing blog_id or user_id" })

	const user = await User.findByPk(user_id)

	if ( !user )
		return res.status(400).json({ error: "invalid user id" })

	const blog = await Blog.findByPk(blog_id)

	if ( !blog )
		return res.status(400).json({ error: "invalid blog id" })

	const newListItem =
	{
		userId: user_id,
		blogId: blog_id
	}

	const listItem = await Readlist.create(newListItem)
	res.json(listItem)
})

router.put("/:id", tokenExtractor, async (req, res) =>
{
	const item = await Readlist.findByPk(req.params.id)

	if ( item )
	{
		if ( item.userId !== req.decodedToken.id )
			return res.status(401).json({ error: "You can only mark your own items as read" })

		const body = req.body

		if ( body.read )
			item.read = body.read

		const result = await item.save()

		res.json(result)
	}
	else
	{
		res.status(404).end()
	}
})

module.exports = router