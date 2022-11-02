const express = require("express")
const app = express()
require("express-async-errors")
const { errorHandler } = require('./util/middleware')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const loginRouter = require("./routers/login")
const logoutRouter = require("./routers/logout")
const usersRouter = require("./routers/users")
const blogsRouter = require("./routers/blogs")
const authorsRouter = require("./routers/authors")
const readinglistsRouter = require("./routers/readinglists")
//

app.use(express.json())

app.use("/api/login", loginRouter)
app.use("/api/logout", logoutRouter)
app.use("/api/users", usersRouter)
app.use("/api/blogs", blogsRouter)
app.use("/api/authors", authorsRouter)
app.use("/api/readinglists", readinglistsRouter)

app.use(errorHandler)

//
const start = async () =>
{
	connectToDatabase()

	app.listen(PORT, () =>
	{
		console.log(`Server running on port ${PORT}`)
	})
}

start()
