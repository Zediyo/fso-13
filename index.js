const express = require("express")
const app = express()
require("express-async-errors")
const { errorHandler } = require('./util/middleware')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const loginRouter = require("./routers/login")
const usersRouter = require("./routers/users")
const blogsRouter = require("./routers/blogs")
const authorsRouter = require("./routers/authors")
//

app.use(express.json())

app.use("/api/login", loginRouter)
app.use("/api/users", usersRouter)
app.use("/api/blogs", blogsRouter)
app.use("/api/authors", authorsRouter)

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
