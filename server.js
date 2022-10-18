const express = require('express')
const app = express()
const cors = require('cors')
const allroutes = require('./routes')
const dbConection = require('./database/config')

require('dotenv').config()
app.use(cors())
app.use(express.json())
dbConection()
app.use(allroutes)



app.listen(process.env.PORT, () => {
    console.log('Server listen in port', process.env.PORT)
})