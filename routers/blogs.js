const router = require("express").Router()
const { Op } = require('sequelize')

const { tokenExtractor } = require("../util/middleware")
const { Blog } = require("../models")
const { User } = require("../models")

router.get("/", async (req, res) =>
{
	let where = {}

	if (req.query.search)
	{
		where = 
		{
			[Op.or]:
			[
				{ title: { [Op.iLike]: "%" + req.query.search + "%" } },
				{ author: { [Op.iLike]: "%" + req.query.search + "%" } }
			]
		}
		
	
	}

	const blogs = await Blog.findAll({
		attributes: { exclude: ["userId"] },
		include:
		{
			model: User,
			attributes: ["name"]
		},
		where,
		order: [ [ "likes", "DESC" ] ]
	})

	res.json(blogs)
})

router.post("/", tokenExtractor, async (req, res) =>
{
	const user = await User.findByPk(req.decodedToken.id)

	if ( !user )
		return res.status(400).json({ error: "invalid user id" })

	const newBlog =
	{
		...req.body,
		userId: user.id
	}

	const blog = await Blog.create(newBlog)
	res.json(blog)
})

//
const blogFinder = async (req, res, next) =>
{
	req.blog = await Blog.findByPk(req.params.id,{
		attributes: { exclude: ["userId"] },
		include:
		{
			model: User,
			attributes: ["name"]
		}
	})

	next()
}

router.get('/:id', blogFinder, async (req, res) =>
{
	const blog = req.blog

	if ( blog )
	{
		res.json(blog)
	}
	else
	{
		res.status(404).end()
	}
})

router.put("/:id", blogFinder, async (req, res) =>
{
	const blog = req.blog

	if ( blog )
	{
		const body = req.body

		if ( body.likes )
			blog.likes = body.likes

		await blog.save()

		res.json(blog)
	}
	else
	{
		res.status(404).end()
	}
})

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) =>
{
	const blog = req.blog

	if ( req.decodedToken.id !== blog.userId )
		return res.status(401).json({ error: "Only blog owner can delete the blog" })


	if ( blog )
	{
		blog.destroy()
		res.status(204).end()
	}
	else
	{
		res.status(404).end()
	}
})

module.exports = router