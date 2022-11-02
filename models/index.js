const Blog = require("./blog")
const User = require("./user")
const Readlist = require("./readlist")
const Token = require("./token")

User.hasMany(Blog)
Blog.belongsTo(User)

Token.belongsTo(User)
User.hasOne(Token)

User.belongsToMany(Blog, { through: Readlist, as: "blogsToRead" })
Blog.belongsToMany(User, { through: Readlist, as: "onToReadList" })

module.exports =
{
	Blog,
	User,
	Readlist,
	Token
}