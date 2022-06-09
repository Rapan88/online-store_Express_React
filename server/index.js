require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const app = express()
const errorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware')
const router = require('./routes/index')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

//Last middleware
app.use(errorHandlingMiddleware)


const PORT = process.env.PORT

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log("Server started"))
    } catch (e) {
        console.log(e)
    }
}

start()

